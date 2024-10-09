import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-tide',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './add-tide.component.html',
  styleUrls: ['./add-tide.component.scss'],
  providers: [DatePipe]
})
export class AddTideComponent {
  @Output() tideAdded = new EventEmitter<any>();
  
  tide = {
    type: '',
    name: '',
    code: '',
    image: '',
    pdf: '' // Thêm trường pdf để lưu thông tin file PDF
  };

  isEditMode = false; // Biến để theo dõi chế độ chỉnh sửa
  selectedFile: File | null = null; // Lưu trữ file đã chọn

  constructor(private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra chế độ chỉnh sửa
      const tideToEdit = navigation.extras.state['tideToEdit']; // Đổi thành tideToEdit
      if (tideToEdit) {
        this.tide = {
          type: tideToEdit.type,
          name: tideToEdit.name,
          code: tideToEdit.code,
          image: tideToEdit.image,
          pdf: tideToEdit.pdf // Thêm trường pdf
        };
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Lưu trữ file đã chọn
      if (file.type === 'application/pdf') {
        this.tide.pdf = file.name; // Lưu tên file PDF
      } else {
        this.tide.image = file.name; // Lưu tên file hình ảnh nếu không phải PDF
      }
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.tideAdded.emit(this.tide); // Cập nhật hiện tại
    } else {
      this.tideAdded.emit(this.tide); // Thêm mới
    }
    this.resetForm(); // Đặt lại form sau khi gửi
  }

  resetForm() {
    this.selectedFile = null; // Đặt lại file đã chọn
    this.tide = { type: '', name: '', code: '', image: '', pdf: '' }; // Đặt lại thông tin tide
  }

  goBack() {
    this.router.navigate(['/tide']); // Quay lại trang danh sách
  }
}
