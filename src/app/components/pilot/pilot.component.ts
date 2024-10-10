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
  selector: 'app-pilot',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QuillModule,PaginatorModule], 
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  constructor(private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getPilotItems(this.limit, this.rows);
  }
  getPilotItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIHoaTieu}`, this.item).subscribe(res => {
      this.setPilotItems(res || []);
    });
  }
  setPilotItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((pilot: any) => ({
        id: pilot.id,
        name: pilot.name,
        rank: pilot.rank,
        image: pilot.image,

      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getPilotItems(this.first, this.rows);
  }

  editPilot(item: any) {
    // console.log(item);
    const sendItem = {
      id: item.id,
      name: item.name,
      rank: item.rank,
      image: item.image,
      status: item.status,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/pilot/add'])
  }
  deleteNews(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIHoaTieu + "/" + id)
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

