import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';
import { AddNewComponent } from './add-new/add-new.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule, AddNewComponent,PaginatorModule], 
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent {
  news = [
    { name: 'Nguyễn Văn A', detail: 'nguyenvana@example.com', image: 'https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/personal-brand-3.jpg', status: "Hiển thị", date: "22/09/2024", edit: 'Thêm Xóa' },
    { name: 'Trần Thị B', detail: 'tranthib@example.com', image: 'https://deliaf.blog/wp-content/uploads/2020/03/personal-growth.png', status: "Hiển thị", date: "22/09/2024", edit: '' },
  ];
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0; 

  showAddNew = false;

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
  toggleAddNew() {
    this.showAddNew = !this.showAddNew;
  }

  addNews(newNews: any) {
    const newItem = {
      name: newNews.title,
      detail: newNews.content,
      image: newNews.image,
      status: newNews.status,
      date: new Date().toLocaleDateString(), // Ngày đăng hiện tại
      edit: 'Chỉnh sửa Xóa' // Cung cấp giá trị cho thuộc tính edit
    };
    this.news.push(newItem);
    this.showAddNew = false;
  }

  editNews(index: number) {
    const newsToEdit = this.news[index];
    this.router.navigate(['/news/add'], { state: { isEditMode: true, newsToEdit } });
  }
  deleteNews(index: number) {
    this.news.splice(index, 1); // Xóa user tại index
  }
}
