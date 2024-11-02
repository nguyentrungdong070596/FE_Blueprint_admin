import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Nhập mô-đun Button
import { DataService } from '../../core/services/data.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImageModule, CommonModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private _dataService: DataService) { }

  ngOnInit(): void { }

  onToggleSidebar() {
    const currentToggleState = this._dataService.getIsToggleSidebar();
    this._dataService.setIsToggleSidebar(!currentToggleState);
  }

  isToggleSidebar(): boolean {
    return this._dataService.getIsToggleSidebar();
  }


  logout() {
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
  }
 
}
