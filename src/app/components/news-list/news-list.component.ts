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

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule, AddNewComponent, PaginatorModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
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

  editNews(item: any) {
    // console.log(item);
    const sendItem = {
      id: item.id,
      title: item.title,
      content: item.content,
      image: item.image,
      status: item.status,
      postdate: item.postdate,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/news/add'])
  }
  deleteNews(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APINews + "/" + id)
      .subscribe(
        (res) => {
          console.log('News delete successfully:', res);
          window.location.reload();
        },
        (error) => {
          console.error('Error delete news:', error);
        }
      );
  }
  onAdd(): void{
    this._dataService.setData(null);
  }


}
