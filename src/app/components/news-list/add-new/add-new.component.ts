import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
  providers: [DatePipe]
})
export class AddNewComponent implements OnInit {
  @Output() newsAdded = new EventEmitter<any>();
  
  newsForm!: FormGroup; // Tạo FormGroup cho tin tức
  isEditMode = false; // Kiểm tra chế độ chỉnh sửa
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; 
      const newsToEdit = navigation.extras.state['newsToEdit']; 
      if (newsToEdit) {
        this.setFormValues(newsToEdit);
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [''], // Chỉ dùng để lưu tên tệp
      status: ['Hiển thị', Validators.required],
      date: ['', Validators.required],
    });
  }

  setFormValues(data: any) {
    this.newsForm.patchValue({
      title: data.name,
      content: data.detail,
      image: data.image,
      status: data.status,
      date: data.date
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.newsForm.patchValue({ image: file.name });
    }
  }

  onSubmit() {
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.newsAdded.emit(this.newsForm.value); // Gửi dữ liệu tin tức
    this.resetForm();
  }

  resetForm() {
    this.newsForm.reset({
      title: '',
      content: '',
      image: '',
      status: 'Hiển thị',
      date: ''
    });
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/news']);
  }
}
