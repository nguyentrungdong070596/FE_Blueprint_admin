import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-pilot',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent {
  pilots = [
    { name: 'Vũ Ngọc An',image: 'https://vungtaupilot.com/datafiles/setone/thumb_1488776372_IMG_8052.JPG',range :'Hoa tiêu ngoại hạng', edit: 'Chỉnh sửa Xóa' },
    { name: 'Phạm Trung Tín',image: 'https://vungtaupilot.com/datafiles/setone/thumb_1488776057_IMG_8020.JPG',range :'Hoa tiêu ngoại hạng', edit: 'Chỉnh sửa Xóa' },
  ];
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0; 

  showAddPilot = false;

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

  toggleAddPilot() {
    this.showAddPilot = !this.showAddPilot;
  }

  addPilot(newPilot: any) {
    const newItem = {
      name: newPilot.name,
      image: newPilot.image,
      range : newPilot.range,
      edit: 'Chỉnh sửa Xóa' // Cung cấp giá trị cho thuộc tính edit
    };
    this.pilots.push(newItem);
    this.showAddPilot = false;
  }

  editPilot(index: number) {
    const pilotToEdit = this.pilots[index];
    this.router.navigate(['/pilot/add'], { state: { isEditMode: true, pilotToEdit } });
  }
  deletePilot(index: number) {
    this.pilots.splice(index, 1); // Xóa user tại index
  }
  
  addPilots() {
    console.log('Thêm mới được nhấn');
  }
}

