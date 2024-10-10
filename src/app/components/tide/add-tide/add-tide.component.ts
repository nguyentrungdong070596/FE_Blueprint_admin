import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button'; 



@Component({
  selector: 'app-add-tide',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule,ReactiveFormsModule,ButtonModule],
  templateUrl: './add-tide.component.html',
  styleUrls: ['./add-tide.component.scss'],
  providers: [DatePipe]
})
export class AddTideComponent implements OnInit {
  @Output() tideAdded = new EventEmitter<any>();
  
  tideForm!: FormGroup; // Khai báo formGroup
  isEditMode = false; // Biến để theo dõi chế độ chỉnh sửa
  selectedFile: File | null = null; // Lưu trữ file đã chọn

  constructor(private router: Router, private datePipe: DatePipe, private fb: FormBuilder) {
    this.tideForm = this.fb.group({ // Khởi tạo formGroup
      pdf: ['', Validators.required], // Thêm validator cho trường pdf
    });
  }

  ngOnInit() {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra chế độ chỉnh sửa
      const tideToEdit = navigation.extras.state['tideToEdit']; // Đổi thành tideToEdit
      if (tideToEdit) {
        // Nếu ở chế độ chỉnh sửa, thiết lập các trường trong form
        this.tideForm.patchValue({
          pdf: tideToEdit.pdf // Thêm trường pdf vào form
        });
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Lưu trữ file đã chọn
      if (file.type === 'application/pdf') {
        this.tideForm.patchValue({ pdf: file.name }); // Cập nhật tên file PDF vào form
      }
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.tideAdded.emit({ ...this.tideForm.value, isEditMode: true }); // Cập nhật hiện tại
    } else {
      this.tideAdded.emit({ ...this.tideForm.value, isEditMode: false }); // Thêm mới
    }
    this.resetForm(); // Đặt lại form sau khi gửi
  }

  resetForm() {
    this.selectedFile = null; // Đặt lại file đã chọn
    this.tideForm.reset(); // Đặt lại form
  }

  goBack() {
    this.router.navigate(['/tide']); // Quay lại trang danh sách
  }
}
