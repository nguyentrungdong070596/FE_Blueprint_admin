import { DataService } from './../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PaginatorModule } from 'primeng/paginator';
import { AddNewComponent } from './add-new/add-new.component';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { environment } from '../../../environment/environment';
import { ImageModule } from 'primeng/image';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [DynamicDialogModule, CommonModule, RouterModule, FormsModule, QuillModule, AddNewComponent, PaginatorModule, ImageModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  providers: [DialogService]
})
export class NewsListComponent implements OnInit {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  ref: DynamicDialogRef | undefined;


  constructor(private router: Router, private _dataService: DataService, public dialogService: DialogService,) { }
  ngOnInit(): void {
    this.getNewsEventsItems(this.limit, this.rows);
  }
  getNewsEventsItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APINews}`, this.item).subscribe(res => {
      this.setNewsEventsItems(res || []);
    });
  }
  setNewsEventsItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((news: any) => ({
        id: news.id,
        title: news.title,
        url: news.url,
        content: news.content,
        status: news.status,
        postdate: news.postdate,
        image: `${news.image}`
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getNewsEventsItems(this.first, this.rows);
  }

  show(item: any) {
    const dialogConfig: any = {
      width: '80vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    };

    // Kiểm tra nếu có item, thì thêm dữ liệu vào
    if (item) {
      dialogConfig.data = {
        id: item.id,
        title: item.title,
        content: item.content,
        image: item.image,
        status: item.status,
        postdate: item.postdate,
      };
    }

    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddNewComponent, dialogConfig);
    this.ref.onClose.subscribe((product: any) => {
      this.getNewsEventsItems(this.first, this.rows);
    });
  }
  deleteNews(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APINews + "/" + id)
      .subscribe(
        (res) => {
          this.getNewsEventsItems(this.first, this.rows);
        },
        (error) => {
        }
      );
  }
}
