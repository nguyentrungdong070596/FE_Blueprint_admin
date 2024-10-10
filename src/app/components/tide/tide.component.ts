import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Đảm bảo đã import ở đây

@Component({
  selector: 'app-tide',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tide.component.html',
  styleUrls: ['./tide.component.scss'] // Chỉnh sửa từ 'styleUrl' thành 'styleUrls'
})
export class TideComponent {
  selectedMonth: string = '';
  months = [
    { name: 'Lịch tháng 1-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file1.pdf' },
    { name: 'Lịch tháng 2-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file2.pdf' },
    { name: 'Lịch tháng 3-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file3.pdf' },
    { name: 'Lịch tháng 4-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file4.pdf' },
    { name: 'Lịch tháng 5-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file5.pdf' },
    { name: 'Lịch tháng 6-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file6.pdf' },
    { name: 'Lịch tháng 7-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file7.pdf' },
    { name: 'Lịch tháng 8-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file8.pdf' },
    { name: 'Lịch tháng 9-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file9.pdf' },
    { name: 'Lịch tháng 10-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file10.pdf' },
    { name: 'Lịch tháng 11-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file11.pdf' },
    { name: 'Lịch tháng 12-2017', status: 'Hiện', downloadLink: '/assets/images/tide/file12.pdf' },
  ];

  onMonthChange() {
    // Xử lý khi người dùng chọn tháng mới
    console.log('Tháng được chọn:', this.selectedMonth);
  }

  addTides() {
    console.log('Thêm mới được nhấn');
    // Chuyển hướng tới trang thêm mới
    // Chúng ta có thể sử dụng Router để chuyển hướng nếu cần
  }

  editTides(index: number) {
    console.log(`Chỉnh sửa tháng: ${index + 1}`);
    // Logic để chỉnh sửa tháng
  }

  deleteTides(index: number) {
    console.log(`Xóa tháng: ${index + 1}`);
    // Xác nhận và xóa tháng từ mảng
    this.months.splice(index, 1);
  }
}
