import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../environment/environment';



@Component({
  selector: 'app-monnuoc',
  standalone: true,
  imports: [PdfViewerModule, RouterModule,CommonModule],
  templateUrl: './monnuoc.component.html',
  styleUrls: ['./monnuoc.component.scss']
})
export class MonnuocComponent {
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
    this._dataService.GetItem(`${StringAPI.APIManeuveringDraft}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    console.log(values);
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item.id,
        dataurl: item.dataurl,
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
      dataurl: item.dataurl,
      status: item.status,
      postdate: item.postdate,
    };
    this._dataService.setData(sendItem);
    this.router.navigate(['/monnuoc/add'])
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
    console.log(item);
  }

  OnDelete(id: any) {
    
    this._dataService.delete(StringAPI.APIManeuveringDraft + "/" + id)
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
