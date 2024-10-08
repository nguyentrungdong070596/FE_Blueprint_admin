import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-monnuoc',
  standalone: true,
  imports: [PdfViewerModule, RouterModule],
  templateUrl: './monnuoc.component.html',
  styleUrls: ['./monnuoc.component.scss']
})
export class MonnuocComponent {
  zoomLevel = 1.0;
  page = 1;  // Trang hiện tại
  totalPages = 0;  // Tổng số trang trong PDF

  increaseZoom() {
    this.zoomLevel += 0.1;
  }

  decreaseZoom() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  onPdfLoad(pdf: any) {
    this.totalPages = pdf.numPages;  // Lấy tổng số trang khi PDF được tải
  }

  addNew() {
    console.log('Thêm mới được nhấn');
  }

  delete() {
    console.log('Xóa được nhấn');
  }

  save() {
    console.log('Lưu được nhấn');
  }
}
