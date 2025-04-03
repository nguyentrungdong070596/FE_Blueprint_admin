import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Nhập mô-đun Button
import { DataService } from '../../core/services/data.service';
import { StringAPI } from '../stringAPI/string_api';
import { AuthService } from '../../../core/auth/auth.service';
import { tap } from 'rxjs';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule, CommonModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private _dataService: DataService, private _authService: AuthService
  ) {
    this.loadUserLoginPromise(); // Gọi hàm loadUser ở đây

    this.const_user = {
      ...this.const_user,

    };
  }
  const_userdata: any = {}
  const_user: any = {}

  ngOnInit(): void { }

  onToggleSidebar() {
    const currentToggleState = this._dataService.getIsToggleSidebar();
    this._dataService.setIsToggleSidebar(!currentToggleState);
  }

  isToggleSidebar(): boolean {
    return this._dataService.getIsToggleSidebar();
  }


  logout() {
    this._authService.logout(); // Gọi hàm logout từ AuthService}
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
  }


  async loadUserLoginPromise(): Promise<void> {
    try {
      this.const_userdata = this._authService.getParseTokenUser();

      const res: any = await this._dataService.get(`${StringAPI.getUsername}/${this.const_userdata.username}`).toPromise();
      this.const_user = res?.data || [];

    } catch (error) {
      //console.error('Error loading user login', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

}
