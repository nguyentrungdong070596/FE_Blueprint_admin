import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../environment/environment';
import { StringAPI } from '../../shared/stringAPI/string_api';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule], // Đảm bảo import CarouselModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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
    this._dataService.GetItem(`${StringAPI.APICarousel}`, this.item).subscribe(res => {
      this.setDichvuItems(res || []);
    });
  }
  setDichvuItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((service: any) => ({
        id: service.id,
        image: service.image,
        status: service.status,
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
      image: item.image,
      status: item.status,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/dashboard/add'])
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
    console.log(item);
  }

  OnDelete(id: any) {
    
    this._dataService.delete(StringAPI.APICarousel + "/" + id)
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
