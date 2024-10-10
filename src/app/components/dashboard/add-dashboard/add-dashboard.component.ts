import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-add-dashboard',
  standalone: true,
  imports :[CommonModule,ReactiveFormsModule],
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss']
})
export class AddDashboardComponent implements OnInit {
  dashboardForm!: FormGroup;  // Khai báo FormGroup để quản lý form
  selectedImage: File | null = null;  // Biến để giữ hình ảnh đã chọn
  isEditMode: boolean = false; // Biến để kiểm tra chế độ chỉnh sửa

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Khởi tạo FormGroup với các trường cần thiết
    this.dashboardForm = this.formBuilder.group({
      file: [null, Validators.required] // Chỉ giữ lại trường tải lên hình ảnh
    });

    // Nếu bạn có logic để xác định xem có đang trong chế độ chỉnh sửa hay không
    // this.checkEditMode();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('image/'))) {
      this.selectedImage = file;
    } else {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ.');
    }
  }

  onSubmit() {
    if (this.dashboardForm.valid && this.selectedImage) {
      console.log('Lưu thông tin hình ảnh:', {
        file: this.selectedImage,
      });
      // Logic để lưu hình ảnh vào cơ sở dữ liệu tại đây

      // Nếu đang ở chế độ chỉnh sửa, bạn có thể gọi hàm chỉnh sửa
      if (this.isEditMode) {
        this.editImage();
      } else {
        this.router.navigate(['/dashboard']); // Quay về trang dashboard sau khi lưu
      }
    } else {
      alert('Vui lòng kiểm tra thông tin.');
    }
  }

  editImage() {
    // Logic để chỉnh sửa hình ảnh tại đây
    console.log('Chỉnh sửa hình ảnh:', {
      file: this.selectedImage,
    });
    // Sau khi chỉnh sửa xong, quay về trang dashboard
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/dashboard']); // Quay về trang dashboard
  }
}


