import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Nhập mô-đun Button



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule,CommonModule,ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showLogoutMenu = false; // Biến để kiểm tra menu đăng xuất có hiển thị hay không

  constructor(private router: Router) {}

  toggleLogoutMenu() {
    this.showLogoutMenu = !this.showLogoutMenu; // Đảo ngược trạng thái hiển thị của menu
  }

  logout() {
    // Logic đăng xuất (ví dụ: xóa token, điều hướng đến trang đăng nhập, v.v.)
    console.log('Đăng xuất'); // Thay bằng logic đăng xuất thực tế
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
  }
  closeLogoutMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.flex-content')) {
      this.showLogoutMenu = false;
    }
  }
}
