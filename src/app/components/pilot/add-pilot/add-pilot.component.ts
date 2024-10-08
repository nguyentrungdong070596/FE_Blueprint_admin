import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-pilot',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './add-pilot.component.html',
  styleUrls: ['./add-pilot.component.scss'],
  providers: [DatePipe]
})
export class AddPilotComponent {
  @Output() pilotAdded = new EventEmitter<any>();
  
  pilot = {
    name: '',
    image: '',
    range: '',
};

  isEditMode = false; // Thêm biến này để theo dõi chế độ chỉnh sửa

  constructor(private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra kiểu dữ liệu
      const pilotToEdit = navigation.extras.state['pilotToEdit']; // Thay đổi ở đây
      if (pilotToEdit) {
        this.pilot = {
          name: pilotToEdit.name,
          image: pilotToEdit.image,
          range: pilotToEdit.range,
        };
      }
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pilot.image = file.name;
    }
  }
  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.pilotAdded.emit(this.pilot); // Cập nhật với tin tức hiện tại
    } else {
      this.pilotAdded.emit(this.pilot); // Thêm mới
    }
    this.resetForm();
  }

  resetForm() {
    this.pilot = {
      name: '',
      image: '',
      range: '',
    };
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/pilot']);
  }
}



