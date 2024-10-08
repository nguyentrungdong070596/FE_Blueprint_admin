import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, PdfViewerModule],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss'],
  providers: [DatePipe]
})
export class AddServicesComponent {
  @Output() servicesAdded = new EventEmitter<any>();
  
  services = {
    title: '',
    image: '',
    info: '',
    status: 'Hiển thị',
    date: '',
    pdfFile: '',  // Đảm bảo có thuộc tính pdfFile
  };

  isEditMode = false; // Thêm biến này để theo dõi chế độ chỉnh sửa

  constructor(private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra kiểu dữ liệu
      const servicesToEdit = navigation.extras.state['servicesToEdit']; // Thay đổi ở đây
      if (servicesToEdit) {
        this.services = {
          title: servicesToEdit.name,
          image: servicesToEdit.image,
          info: servicesToEdit.info,
          status: servicesToEdit.status,
          date: servicesToEdit.date,
          pdfFile: servicesToEdit.pdfFile // Thêm pdfFile nếu có
        };
      }
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.services.image = file.name;
    }
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.services.pdfFile = file;  // Lưu tệp PDF vào thuộc tính pdfFile
    } else {
      alert('Vui lòng chọn tệp PDF hợp lệ.');
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.servicesAdded.emit(this.services); // Cập nhật với tin tức hiện tại
    } else {
      this.servicesAdded.emit(this.services); // Thêm mới
    }
    this.resetForm();
  }

  resetForm() {
    this.services = {
      title: '',
      image: '',
      info: '',
      status: 'Hiển thị',
      date: '',
      pdfFile: ''  // Đảm bảo có thuộc tính pdfFile
    };
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/services']);
  }
}
