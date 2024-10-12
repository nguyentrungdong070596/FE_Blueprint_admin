import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'; 
import { PaginatorModule } from 'primeng/paginator';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './list-services.component.html',
  styleUrls: ['./list-services.component.scss']
})
export class ListServicesComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getServicelistItems(this.limit, this.rows);
  }
  getServicelistItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIDichvu}`, this.item).subscribe(res => {
      this.setServicelistItems(res || []);
    });
  }
  setServicelistItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((Servicelist: any) => ({
        id: Servicelist.id,
        title: Servicelist.title,
        content: Servicelist.content,
        image: Servicelist.image,
        status: Servicelist.status,
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getServicelistItems(this.first, this.rows);
  }

  editItem(item: any) {
    // console.log(item);
    const sendItem = {
      id: item.id,
      title: item.title,
      content: item.content,
      image: item.image,
      status: item.status,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/list-services/add'])
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIDichvu + "/" + id)
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
    this._dataService.clearData();
  }
}

