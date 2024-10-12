import { DataService } from './../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PaginatorModule } from 'primeng/paginator';
import { AddInfoComponent } from './add-info/add-info.component';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule, AddInfoComponent, PaginatorModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent  implements OnInit {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getIntro(this.limit, this.rows);
  }
  getIntro(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIIntroduction}`, this.item).subscribe(res => {
      this.setIntro(res || []);
    });
  }
  setIntro(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((info: any) => ({
        id: info.id,
        content: info.content,
        status: info.status,
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getIntro(this.first, this.rows);
  }

  editInfo(item: any) {
    console.log(item);
    const sendItem = {
      id: item.id,
      content: item.content,
      status: item.status,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/info/add'])
  }
  deleteInfo(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIIntroduction + "/" + id)
      .subscribe(
        (res) => {
          console.log('delete successfully:', res);
          window.location.reload();
        },
        (error) => {
          console.error('delete news:', error);
        }
      );
  }
  onAdd(): void{
    this._dataService.setData(null);
  }


}

