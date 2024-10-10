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
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule, PaginatorModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getDichvuItems(this.limit, this.rows);
  }
  getDichvuItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetDichvu_Service(`${StringAPI.APIDichvu}`, this.item).subscribe(res => {
      this.setDichvuItems(res || []);
    });
  }
  setDichvuItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((service: any) => ({
        id: service.id,
        title: service.title,
        pdfdata: service.pdfdata,
        status: service.status,
        image: service.image
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getDichvuItems(this.first, this.rows);
  }

  editItem(item: any) {
    const sendItem = {
      id: item.id,
      title: item.title,
      pdfdata: item.pdfdata,
      image: item.image,
      status: item.status,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/services/add'])
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
    console.log(item);
  }

  OnDelete(id: any) {
    
    this._dataService.delete(StringAPI.APIDichvu + "/" + id)
      .subscribe(
        (res) => {
          console.log('service delete successfully:', res);
          window.location.reload();
        },
        (error) => {
          console.error('Error delete service:', error);
        }
      );
  }
  onAdd(): void{
    this._dataService.setData(null);
  }
}
