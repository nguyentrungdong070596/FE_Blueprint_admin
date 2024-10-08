import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './list-services.component.html',
  styleUrls: ['./list-services.component.scss']
})
export class ListServicesComponent {
  list = [
    { title: 'Hoa tiêu hàng hải',image: 'https://www.vungtauship.com/datafiles/thumb_1651414964_1.jpg',content :'Đội ngũ hoa tiêu 100% Hoa Tiêu tốt nghiệp khoa Điều Khiển Tàu Biển trường Đại Học Hàng Hải...',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
    { title: 'Dịch vụ xếp dỡ và vận tải hàng hóa',image: 'https://www.vungtauship.com/datafiles/thumb_1651414964_1488866383_thumb_1488865236_DSC_0237.jpg',content :'- Xếp dỡ hàng hóa tại cảng, tại kho hàng: nông sản, than, phế liệu, clinke…; hàng siêu trường, hàng thiết bị chuyên',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
    { title: 'Cho thuê cano, tàu',image: 'https://www.vungtauship.com/datafiles/thumb_1652413149_cano14.png?v=1652413149',content :'Dịch vụ cano: Đưa đón thuyền viên, hành khách, chuyên gia, nhà thầu và trang thiết bị, phụ tùng: vùng neo Vũng',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
    { title: 'Xuất Nhập Khẩu Hàng Hóa',image: 'https://www.vungtauship.com/datafiles/thumb_1651847594_XUATNHAPKHAU.jpg?v=1651847595',content :'Đại lý Hải quan hàng hóa Xuất nhập khẩu : Bà Rịa - Vũng Tàu , Tp.Hồ Chí Minh, Đồng Nai , Bình Dương , Long An.',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
    { title: 'Thi công các công trình, dự án hàng hải',image: 'https://www.vungtauship.com/datafiles/thumb_1652698028_11.jpg?v=1652698028',content :'- Nạo vét duy tu luồng hàng hải, vùng nước trước cảng, bến phao… - Quản lý, tư vấn các dự án hàng hải.',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
    { title: 'Dịch vụ đại lý tàu biển',image: 'https://www.vungtauship.com/datafiles/thumb_1651414964_1607336836_25eea5275364ba3ae375.jpg',content :'',date:'1/1/2024', edit: 'Chỉnh sửa Xóa' },
  ];
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0; 

  showAddList = false;

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

  toggleAddList() {
    this.showAddList = !this.showAddList;
  }

  addList(newList: any) {
    const newItem = {
      title: newList.title,
      image: newList.image,
      content : newList.content,
      date: newList.date,
      edit: 'Chỉnh sửa Xóa' // Cung cấp giá trị cho thuộc tính edit
    };
    this.list.push(newItem);
    this.showAddList = false;
  }

  editList(index: number) {
    const listToEdit = this.list[index];
    this.router.navigate(['/list-services/add'], { state: { isEditMode: true,listToEdit } });
  }
  deleteList(index: number) {
    this.list.splice(index, 1); // Xóa user tại index
  }
  
  addLists() {
    console.log('Thêm mới được nhấn');
  }
}

