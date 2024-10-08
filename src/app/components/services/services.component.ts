import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    { title: 'Niêm Yết Giá Dịch Vụ Lai Dắt Tại Cảng Biển Áp Dụng Từ Tháng 7 Năm 2024',image: 'https://www.vungtauship.com/datafiles/thumb_1720083978_z5337032327439_95e7855e69703a8c5dbe5e7de9f81011.jpg?v=1720083978',info :'https://tinyurl.com/6kjw9j75', status: "Hiển thị", date: "22/09/2024", edit: 'Thêm Xóa' },
    { title: 'Niêm Yết Giá Dịch Vụ Lai Dắt Tại Cảng Biển Áp Dụng Từ Tháng 7 Năm 2024',image: 'https://www.vungtauship.com/datafiles/thumb_1719835312_5.jpg?v=1719835312',info :'https://tinyurl.com/mshw4xxm', status: "Hiển thị", date: "22/09/2024", edit: 'Thêm Xóa' },
  ];
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0; 

  showAddServices = false;

  constructor(private router: Router) {}
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadData(this.first, this.rows);
  }
  loadData(first: number, rows: number) {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    }

  toggleAddServices() {
    this.showAddServices = !this.showAddServices;
  }

  addServices(newServices: any) {
    const newItem = {
      title: newServices.title,
      image: newServices.image,
      info : newServices.info,
      status: newServices.status,
      date: new Date().toLocaleDateString(), // Ngày đăng hiện tại
      edit: 'Chỉnh sửa Xóa' // Cung cấp giá trị cho thuộc tính edit
    };
    this.services.push(newItem);
    this.showAddServices = false;
  }

  editServices(index: number) {
    const servicesToEdit = this.services[index];
    this.router.navigate(['/services/add'], { state: { isEditMode: true, servicesToEdit } });
  }
  deleteServices(index: number) {
    this.services.splice(index, 1); // Xóa user tại index
  }
  
  addService() {
    console.log('Thêm mới được nhấn');
  }
}
