import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, PdfViewerModule],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss'],
  providers: [DatePipe]
})
export class AddServicesComponent implements OnInit {
  @Output() servicesAdded = new EventEmitter<any>();
  
  servicesForm!: FormGroup; // Đổi tên từ form sang servicesForm
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
      const servicesToEdit = navigation.extras.state['servicesToEdit'];
      if (servicesToEdit) {
        this.setFormValues(servicesToEdit);
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.servicesForm = this.fb.group({
      title: [null, Validators.required],
      image: [null],
      info: [null],
      status: ['Hiển thị', Validators.required],
      date: [null, Validators.required],
      pdfFile: [null],
    });
  }

  setFormValues(data: any) {
    this.servicesForm.patchValue({
      title: data.name,
      image: data.image,
      info: data.info,
      status: data.status,
      date: data.date,
      pdfFile: data.pdfFile,
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.servicesForm.patchValue({ image: file.name });
    }
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.servicesForm.patchValue({ pdfFile: file });
    } else {
      alert('Vui lòng chọn tệp PDF hợp lệ.');
    }
  }

  onSubmit() {
    if (this.servicesForm.invalid) {
      this.servicesForm.markAllAsTouched();
      return;
    }

    const serviceData = this.servicesForm.value;

    if (this.isEditMode) {
      this.servicesAdded.emit(serviceData);
    } else {
      this.servicesAdded.emit(serviceData);
    }
    this.resetForm();
  }

  resetForm() {
    this.servicesForm.reset({
      title: '',
      image: '',
      info: '',
      status: 'Hiển thị',
      date: '',
      pdfFile: '',
    });
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/services']);
  }
}
