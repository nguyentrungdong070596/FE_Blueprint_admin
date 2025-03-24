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
        routerLink: '/home/banner',
        icon: 'pi pi-id-card',
        text: 'Trang chủ',
        items: [
          { routerLink: '/home/banner', icon: 'pi pi-id-card', text: 'Banner' },
          { routerLink: '/home/news', icon: 'pi pi-id-card', text: 'Tin tức' },
          { routerLink: '/home/services', icon: 'pi pi-id-card', text: 'Dịch vụ' },
        ]
      },
      {
        routerLink: '/introduction/lanhdao', icon: 'pi pi-id-card', text: 'Giới thiệu', items: [
          // { routerLink: '/introduction/thungo', icon: 'pi pi-id-card', text: 'Thư ngỏ' },
          // { routerLink: '/introduction/chucnang', icon: 'pi pi-id-card', text: '' },
          { routerLink: '/introduction/lanhdao', icon: 'pi pi-id-card', text: 'Album công ty' },
          { routerLink: '/introduction/danhsachphuongtien', icon: 'pi pi-id-card', text: 'Danh sách phương tiện' },
          { routerLink: '/introduction/luocsu', icon: 'pi pi-id-card', text: ' Lịch sử công ty' },
          { routerLink: '/news/hoatdongcongty', icon: 'pi pi-id-card', text: ' Hoạt động công ty' },

        ]
      },
      // {
      //   routerLink: '/news/tintonghop', icon: 'pi pi-briefcase', text: 'Tin tức',
      //   items: [
      //     { routerLink: '/news/tintonghop', icon: 'pi pi-id-card', text: 'Tin tổng hợp hoạt động' },
      //     { routerLink: '/news/vitridontrahoatieu', icon: 'pi pi-id-card', text: 'Vị trí đón trả hoa tiêu' },
      //     { routerLink: '/news/vanban', icon: 'pi pi-id-card', text: 'Vị trí đón' },
      //     { routerLink: '/news/vunghoatieu', icon: 'pi pi-id-card', text: 'Bài viết tham khảo' },
      //   ]
      // },
      { routerLink: '/news/link-dathangdichvu', icon: 'pi pi-id-card', text: 'Link Đặt Hàng Dịch Vụ' },

      // { routerLink: '/news/hoatdongcongty', icon: 'pi pi-id-card', text: ' Hoạt động công ty' },

      { routerLink: '/news/vitridontrahoatieu', icon: 'pi pi-id-card', text: 'Vị trí đón trả hoa tiêu' },
      { routerLink: '/news/vunghoatieu', icon: 'pi pi-id-card', text: 'Vùng hoa tiêu' },

      { routerLink: '/monnuoc', icon: 'pi pi-calendar', text: 'Giờ điều động và mớn nước' },
      { routerLink: '/giadichvu', icon: 'pi pi-folder', text: 'Bảng giá dịch vụ' },
      { routerLink: '/hoatieu', icon: 'pi pi-users', text: 'Danh sách hoa tiêu' },
      // {
      //   routerLink: '/specification/', icon: 'pi pi-clock', text: 'Thông số kỹ thuật', items: []
      // },

      { routerLink: '/specification/bangthuytrieu', icon: 'pi pi-users', text: 'Bảng thủy triều' },

      { routerLink: '/specification/hethongcangbien', icon: 'pi pi-id-card', text: 'Hệ thống cảng biển' },
      // { routerLink: '/specification/tuyenluong', icon: 'pi pi-users', text: 'Tuyến luồng' },
    ];
  }
}
