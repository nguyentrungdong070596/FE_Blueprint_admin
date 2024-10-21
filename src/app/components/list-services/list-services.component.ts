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
import { AddListServicesComponent } from './add-list-services/add-list-services.component';

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [DynamicDialogModule, CommonModule, RouterModule, FormsModule, QuillModule, PaginatorModule, ImageModule],
  templateUrl: './list-services.component.html',
  styleUrls: ['./list-services.component.scss'],
  providers: [DialogService]
})
export class ListServicesComponent {
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
      };
    }

    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddListServicesComponent, dialogConfig);
    this.ref.onClose.subscribe((product: any) => {
      this.getServicelistItems(this.first, this.rows);
    });
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIDichvu + "/" + id)
      .subscribe(
        (res) => {
          this.getServicelistItems(this.first, this.rows);
        },
        (error) => {
        }
      );
  }
}

