import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {
  vehicles = [
    { type: 'Xe',image: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2020/6/2/809568/Toyota-Fortuner-2020.png',name :'Toyota Fortuner',code:'72A-474.58', edit: 'Chỉnh sửa Xóa' },
    { type: 'Cano',image:'https://i-tour.vn/FileStorage/Article/Thumbnail/CANO.jpg',name :'ĐÒ BIỂN SẠCH',code:'ĐÒ BS', edit: 'Chỉnh sửa Xóa' },
  ];
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0; 

  showAddVehicle = false;

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

  toggleAddVehicle() {
    this.showAddVehicle = !this.showAddVehicle;
  }

  addVehicle(newVehicle: any) {
    const newItem = {
      type: newVehicle.type,
      image: newVehicle.image,
      name : newVehicle.name,
      code : newVehicle.code,
      edit: 'Chỉnh sửa Xóa' // Cung cấp giá trị cho thuộc tính edit
    };
    this.vehicles.push(newItem);
    this.showAddVehicle = false;
  }

  editVehicle(index: number) {
    const vehicleToEdit = this.vehicles[index];
    this.router.navigate(['/vehicle/add'], { state: { isEditMode: true, vehicleToEdit } });
  }
  deleteVehicle(index: number) {
    this.vehicles.splice(index, 1);
  }
  
  addVehicles() {
    console.log('Thêm mới được nhấn');
  }
}

