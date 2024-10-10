import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule], // Đảm bảo import CarouselModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  images: { url: string; name: string }[] = [
    { url: 'assets/images/galleria/galleria_1.jpg', name: 'Hình ảnh 1' },
    { url: 'assets/images/galleria/galleria_2.jpg', name: 'Hình ảnh 2' },
    { url: 'assets/images/galleria/galleria_3.jpg', name: 'Hình ảnh 3' },
  ];

  addNew() {
    // Logic để điều hướng đến trang thêm mới
    // Bạn có thể sử dụng Router để điều hướng
  }

  editImage(index: number) {
    // Logic để chỉnh sửa hình ảnh
    console.log('Chỉnh sửa hình ảnh tại chỉ số:', index);
  }

  deleteImage(index: number) {
    // Logic để xóa hình ảnh
    console.log('Xóa hình ảnh tại chỉ số:', index);
    this.images.splice(index, 1); // Xóa hình ảnh khỏi mảng
  }
}
