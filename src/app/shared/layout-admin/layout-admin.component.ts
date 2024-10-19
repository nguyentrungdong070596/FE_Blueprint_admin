import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterModule, NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss'
})
export class LayoutAdminComponent {
  isToggleSidebar: boolean = false;
  onChangeToggle(event: any){
    this.isToggleSidebar = event;
    console.log(this.isToggleSidebar);
  }
}
