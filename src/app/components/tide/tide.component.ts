import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Đảm bảo đã import ở đây

@Component({
  selector: 'app-tide',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './tide.component.html',
  styleUrl: './tide.component.scss'
})
export class TideComponent {
  selectedMonth: string='';
  months = [
    { name: 'Lịch tháng 1-2017', downloadLink: '/assets/images/tide/file1.pdf' },
    { name: 'Lịch tháng 2-2017', downloadLink: '/assets/images/tide/file2.pdf' },
    { name: 'Lịch tháng 3-2017', downloadLink: '/assets/images/tide/file3.pdf' },
    { name: 'Lịch tháng 4-2017', downloadLink: '/assets/images/tide/file4.pdf' },
    { name: 'Lịch tháng 5-2017', downloadLink: '/assets/images/tide/file5.pdf' },
    { name: 'Lịch tháng 6-2017', downloadLink: '/assets/images/tide/file6.pdf' },
    { name: 'Lịch tháng 7-2017', downloadLink: '/assets/images/tide/file7.pdf'  },
    { name: 'Lịch tháng 8-2017', downloadLink: '/assets/images/tide/file8.pdf'  },
    { name: 'Lịch tháng 9-2017', downloadLink: '/assets/images/tide/file9.pdf'  },
    { name: 'Lịch tháng 10-2017', downloadLink: '/assets/images/tide/file10.pdf'  },
    { name: 'Lịch tháng 11-2017', downloadLink: '/assets/images/tide/file11.pdf'  },
    { name: 'Lịch tháng 12-2017', downloadLink: '/assets/images/tide/file12.pdf'  },
  ];
  onMonthChange() {
    // Xử lý khi người dùng chọn tháng mới
    console.log('Tháng được chọn:', this.selectedMonth);
    // Có thể thêm logic để lọc dữ liệu dựa trên tháng được chọn
  }
  addTide(newTide: any) {
    const newItem = {
      name: newTide.name,
    };
  }
  addTides() {
    console.log('Thêm mới được nhấn');
  }
}

