import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Đảm bảo đã import ở đây
import { environment } from '../../../environment/environment';
import { DataService } from '../../core/services/data.service';
import { StringAPI } from '../../shared/stringAPI/string_api';

@Component({
  selector: 'app-tide',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tide.component.html',
  styleUrls: ['./tide.component.scss'] // Chỉnh sửa từ 'styleUrl' thành 'styleUrls'
})
export class TideComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getItems(this.limit, this.rows);
  }
  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APITide}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item.id,
        pdfuri: item.pdfuri,
        status: item.status,
        postdate: item.postdate,
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getItems(this.first, this.rows);
  }

  editItem(item: any) {
    const sendItem = {
      id: item.id,
      pdfuri: item.pdfuri,
      status: item.status,
      postdate: item.postdate,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/tide/add'])
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    
    this._dataService.delete(StringAPI.APITide + "/" + id)
      .subscribe(
        (res) => {
          console.log('delete successfully:', res);
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
