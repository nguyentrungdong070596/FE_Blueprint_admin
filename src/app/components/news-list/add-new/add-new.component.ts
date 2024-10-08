import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
  providers: [DatePipe]
})
export class AddNewComponent {
  @Output() newsAdded = new EventEmitter<any>();
  
  news = {
    title: '',
    content: '',
    image: '',
    status: 'Hiển thị',
    date: ''
  };

  isEditMode = false; // Thêm biến này để theo dõi chế độ chỉnh sửa

  constructor(private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; // Kiểm tra kiểu dữ liệu
      const newsToEdit = navigation.extras.state['newsToEdit']; // Thay đổi ở đây
      if (newsToEdit) {
        this.news = {
          title: newsToEdit.name,
          content: newsToEdit.detail,
          image: newsToEdit.image,
          status: newsToEdit.status,
          date: newsToEdit.date
        };
      }
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.news.image = file.name;
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Logic cập nhật
      this.newsAdded.emit(this.news); // Cập nhật với tin tức hiện tại
    } else {
      this.newsAdded.emit(this.news); // Thêm mới
    }
    this.resetForm();
  }
  resetForm() {
    this.news = {
      title: '',
      content: '',
      image: '',
      status: 'Hiển thị',
      date: ''
    };
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/news']);
  }
}
