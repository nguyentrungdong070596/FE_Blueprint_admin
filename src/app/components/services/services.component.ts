import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PaginatorModule } from 'primeng/paginator';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../environment/environment';
import { ImageModule } from 'primeng/image';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddServicesComponent } from './add-services/add-services.component';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [DynamicDialogModule, CommonModule, RouterModule, FormsModule, QuillModule, PaginatorModule, ImageModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [DialogService]
})
export class ServicesComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService, private router: Router, private _dataService: DataService) { }
  ngOnInit(): void {
    this.getDichvuItems(this.limit, this.rows);
  }
  getDichvuItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIServicePrice}`, this.item).subscribe(res => {
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
        pdfdata: item.pdfdata,
        image: item.image,
        status: item.status,
      };
    }
    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddServicesComponent, dialogConfig);
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {

    this._dataService.delete(StringAPI.APIServicePrice + "/" + id)
      .subscribe(
        (res) => {
          console.log('service delete successfully:', res);
          // window.location.reload();
          this.router.navigate(['/services']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
        }
      );
  }
}
