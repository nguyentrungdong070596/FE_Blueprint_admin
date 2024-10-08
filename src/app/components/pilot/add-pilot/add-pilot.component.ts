import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-pilot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './add-pilot.component.html',
  styleUrls: ['./add-pilot.component.scss'],
  providers: [DatePipe]
})
export class AddPilotComponent implements OnInit {
  @Output() pilotAdded = new EventEmitter<any>();
  pilotForm!: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false;
      const pilotToEdit = navigation.extras.state['pilotToEdit'];
      if (pilotToEdit) {
        this.setFormValues(pilotToEdit);
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.pilotForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      range: ['', Validators.required],
    });
  }

  setFormValues(data: any) {
    this.pilotForm.patchValue({
      name: data.name,
      image: data.image,
      range: data.range,
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pilotForm.patchValue({ image: file.name });
    }
  }

  onSubmit() {
    if (this.pilotForm.invalid) {
      this.pilotForm.markAllAsTouched();
      return;
    }

    const pilotData = this.pilotForm.value;

    if (this.isEditMode) {
      this.pilotAdded.emit(pilotData);
    } else {
      this.pilotAdded.emit(pilotData);
    }
    this.resetForm();
  }

  resetForm() {
    this.pilotForm.reset();
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/pilot']);
  }
}
