import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-add-list-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, PdfViewerModule],
  templateUrl: './add-list-services.component.html',
  styleUrls: ['./add-list-services.component.scss'],
  providers: [DatePipe]
})
export class AddListServicesComponent implements OnInit {
  @Output() listAdded = new EventEmitter<any>();
  
  listForm!: FormGroup; // Đổi tên từ form sang servicesForm
  isEditMode = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false;
      const listToEdit = navigation.extras.state['listToEdit'];
      if (listToEdit) {
        this.setFormValues(listToEdit);
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.listForm = this.fb.group({
      title: [null, Validators.required],
      image: [null],
      content: [null],
      date: [null, Validators.required],
    });
  }

  setFormValues(data: any) {
    this.listForm.patchValue({
      title: data.title,
      image: data.image,
      content: data.content,
      date: data.date
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.listForm.patchValue({ image: file.name });
    }
  }
  onSubmit() {
    if (this.listForm.invalid) {
      this.listForm.markAllAsTouched();
      return;
    }

    const serviceData = this.listForm.value;

    if (this.isEditMode) {
      this.listAdded.emit(serviceData);
    } else {
      this.listAdded.emit(serviceData);
    }
    this.resetForm();
  }

  resetForm() {
    this.listForm.reset({
      title: '',
      image: '',
      content: '',
      date: '',
    });
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/list-services']);
  }
}




























