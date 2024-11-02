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

  constructor(private _dataService: DataService) { }

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
      {
        routerLink: '/home',
        icon: 'pi pi-id-card',
        text: 'Trang chủ',
        items: [
          { routerLink: '/home/banner', icon: 'pi pi-id-card', text: 'Banner' },
          { routerLink: '/home/news', icon: 'pi pi-id-card', text: 'Tin tức' },
          { routerLink: '/home/services', icon: 'pi pi-id-card', text: 'Dịch vụ' },
        ]
      },
      {
        routerLink: '/introduction', icon: 'pi pi-id-card', text: 'Giới thiệu', items: [
          { routerLink: '/introduction/thungo', icon: 'pi pi-id-card', text: 'Thư ngỏ' },
          { routerLink: '/introduction/chucnang', icon: 'pi pi-id-card', text: 'Chức năng nhiệm vụ' },
          { routerLink: '/introduction/lanhdao', icon: 'pi pi-id-card', text: 'Ban lãnh đạo' },
          { routerLink: '/introduction/tochuc', icon: 'pi pi-id-card', text: 'Sơ đồ tổ chức' },
          { routerLink: '/introduction/luocsu', icon: 'pi pi-id-card', text: 'Lược sử' },
        ]
      },
      {
        routerLink: '/tintuc', icon: 'pi pi-briefcase', text: 'Tin tức',
        items: [
          { routerLink: '/tintuc/tintonghop', icon: 'pi pi-id-card', text: 'Tin tổng hợp hoạt động' },
          { routerLink: '/tintuc/thongbao', icon: 'pi pi-id-card', text: 'Thông báo' },
          { routerLink: '/tintuc/vanban', icon: 'pi pi-id-card', text: 'Văn bản' },
          { routerLink: '/tintuc/baiviet', icon: 'pi pi-id-card', text: 'Bài viết tham khảo' },
        ]
      },
      { routerLink: '/monnuoc', icon: 'pi pi-calendar', text: 'Giờ điều động và mớn nước' },
      { routerLink: '/giadichvu', icon: 'pi pi-folder', text: 'Bảng giá dịch vụ' },
      { routerLink: '/hoatieu', icon: 'pi pi-users', text: 'Danh sách hoa tiêu' },
      {
        routerLink: '/thongso', icon: 'pi pi-clock', text: 'Thông số kỹ thuật', items: [
          { routerLink: '/thongso/tintonghop', icon: 'pi pi-id-card', text: 'Vùng nước cảng biển' },
          { routerLink: '/thongso/tuyenluong', icon: 'pi pi-id-card', text: 'Tuyến luồng' },
          { routerLink: '/thongso/neodau', icon: 'pi pi-id-card', text: 'Khu neo đậu' },
          { routerLink: '/thongso/vunghoatieu', icon: 'pi pi-id-card', text: 'Vùng đón trả hoa tiêu' },
          { routerLink: '/thongso/thuytrieu', icon: 'pi pi-id-card', text: 'Bảng thủy triều' },
          { routerLink: '/thongso/trieuky', icon: 'pi pi-id-card', text: 'Các trạm triều ký' },
        ]
      },
      // { routerLink: '/services', icon: 'pi pi-dollar', text: 'Giá dịch vụ' },
      // { routerLink: '/vehicle', icon: 'pi pi-car', text: 'Danh sách phương tiện' },
      // { routerLink: '/tide', icon: 'pi pi-calendar-clock', text: 'Lịch thủy triều' }
    ];
  }
}
