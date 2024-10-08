import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-monnuoc',
  standalone: true,
  imports: [FormsModule, PdfViewerModule, CommonModule],
  templateUrl: './add-monnuoc.component.html',
  styleUrls: ['./add-monnuoc.component.scss']
})
export class AddMonnuocComponent {
  selectedFile: File | null = null;
  date: string = '';  // Khai báo biến date
  value: string = ''; // Biến value
  pdfSrc: SafeUrl | null = null;  // Biến để giữ URL an toàn cho PDF

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;

      // Tạo URL an toàn cho PDF
      const objectUrl = URL.createObjectURL(file);
      console.log("PDF URL:", objectUrl);  // Kiểm tra URL trong console
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);  // Lưu URL an toàn để hiển thị trong iframe
    } else {
      alert('Vui lòng chọn tệp PDF hợp lệ.');
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      // Chuyển đổi ngày sang định dạng dd/mm/yy
      const formattedDate = this.formatDate(this.date);
      
      // Logic để lưu thông tin
      console.log('Lưu thông tin:', {
        date: formattedDate,  // Lưu ngày đã định dạng
        value: this.value,    // Lưu giá trị
        file: this.selectedFile,
      });
      // Thực hiện lưu file PDF và thông tin vào cơ sở dữ liệu tại đây
    } else {
      alert('Vui lòng tải lên tệp PDF.');
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');  // Ngày
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // Tháng (tăng thêm 1 vì tháng bắt đầu từ 0)
    const year = d.getFullYear().toString().slice(-2);  // Hai chữ số cuối của năm
    return `${day}/${month}/${year}`;  // Trả về định dạng dd/mm/yy
  }

  goBack() {
    this.router.navigate(['/monnuoc']);  // Điều hướng trở lại trang danh sách môn nước
  }
}
