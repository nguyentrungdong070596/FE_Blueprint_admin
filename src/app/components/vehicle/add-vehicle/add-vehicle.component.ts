import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-vehilce',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [DatePipe]
})
export class AddVehicleComponent {
  @Output() vehicleAdded = new EventEmitter<any>();
  
  vehicle = {
    type: '',
    image: '',
    name: '',
    code:'',
};

  isEditMode = false; // Thêm biến này để theo dõi chế độ chỉnh sửa

  constructor(private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra kiểu dữ liệu
      const vehilceToEdit = navigation.extras.state['vehilceToEdit']; // Thay đổi ở đây
      if (vehilceToEdit) {
        this.vehicle = {
          type: vehilceToEdit.type,
          image: vehilceToEdit.image,
          name: vehilceToEdit.name,
          code: vehilceToEdit.code,
        };
      }
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.vehicle.image = file.name;
    }
  }
  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.vehicleAdded.emit(this.vehicle); // Cập nhật hiện tại
    } else {
      this.vehicleAdded.emit(this.vehicle); // Thêm mới
    }
    this.resetForm();
  }

  resetForm() {
    this.vehicle = {
      type: '',
      image: '',
      name: '',
      code:'',
    };
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/vehicle']);
  }
}

