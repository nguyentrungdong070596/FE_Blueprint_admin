import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageModule, SidebarModule, ButtonModule, MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  links: any;

  constructor(private _dataService: DataService) {}

  onToggleSidebar() {
    const currentToggleState = this._dataService.getIsToggleSidebar();
    this._dataService.setIsToggleSidebar(!currentToggleState);
  }

  isToggleSidebar(): boolean {
    return this._dataService.getIsToggleSidebar();
  }

  ngOnInit(): void {
    this.createLinks()
  }

  createLinks(): void {
    this.links = [
      { routerLink: '/info', icon: 'pi pi-id-card', text: 'Giới thiệu' },
      { routerLink: '/list-services', icon: 'pi pi-briefcase', text: 'Các dịch vụ' },
      { routerLink: '/news', icon: 'pi pi-calendar', text: 'Tin tức và sự kiện' },
      { routerLink: '/dashboard', icon: 'pi pi-folder', text: 'Danh mục' },
      { routerLink: '/monnuoc', icon: 'pi pi-clock', text: 'Giờ điều động và mớn nước' },
      { routerLink: '/services', icon: 'pi pi-dollar', text: 'Giá dịch vụ' },
      { routerLink: '/pilot', icon: 'pi pi-users', text: 'Danh sách hoa tiêu' },
      { routerLink: '/vehicle', icon: 'pi pi-car', text: 'Danh sách phương tiện' },
      { routerLink: '/tide', icon: 'pi pi-calendar-clock', text: 'Lịch thủy triều' }
    ];
  }
}
