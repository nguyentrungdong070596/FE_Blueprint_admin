import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CarouselModule } from 'primeng/carousel'; // Import CarouselModule của PrimeNG

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CarouselModule], // Đảm bảo import CarouselModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  images: string[] = [
    'assets/images/galleria/galleria_1.jpg',
    'assets/images/galleria/galleria_2.jpg',
    'assets/images/galleria/galleria_3.jpg',
  ];
}
