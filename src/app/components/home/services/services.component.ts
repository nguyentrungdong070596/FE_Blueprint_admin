import { Component } from '@angular/core';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { environment } from '../../../../environment/environment';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { FormComponent } from '../../../shared/components/form/form.component';
import { FormServicesComponent } from '../../../shared/components/form-services/form-services.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonModule, CommonModule, ImageModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  providers: [DialogService]
})
export class ServicesComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService, private router: Router, private _dataService: DataService) { }
  loading: boolean = false;

  searchText: string = '';
  private searchTimeout: any;

  ngOnInit(): void {
    this.getItems(this.limit, this.rows);
  }
  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this.item.itemType = '2';
    this.item.name = this.searchText ?? "undefined";

    this._dataService.GetItem(`${StringAPI.APIDichvu}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item?.id,
        title: item?.title,
        subtitle: item?.subtitle,
        image: item?.image,
        pdfurl: item?.pdfurl,
        postdate: item?.postdate,
        content: item?.content,
        status: item?.status,
      }));
      //consolethis.const_data);
      this.totalRecords = values.totalRecords;
    }
  }

  search(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout); // Xoá timeout trước đó nếu có
    }
    this.searchTimeout = setTimeout(() => {
      this.loading = true;
      this.searchText = query;
      this.first = 0;
      this.getItems(this.first, this.rows);
    }, 300);
  }

  onInput(event: any): void {
    const query = event.target.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.search(query);
    }, 500);
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getItems(this.first, this.rows);
  }

  show(item: any) {
    const dialogConfig: any = {
      width: '80vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        itemData: {
          id: item?.id,
          title: item?.title,
          subtitle: item?.subtitle,
          image: item?.image,
          pdfurl: item?.pdfurl,
          content: item?.content,
          postdate: item?.postdate,
          status: item?.status,
        },
        fields: [
          { name: 'pdfurl', required: true },
          { name: 'image', required: true },
          { name: 'title', required: true },
          { name: 'content', required: true },
          { name: 'postdate', required: true },
          { name: 'subtitle', required: true },
          { name: 'status', required: true },
        ],
        item_type: 'dichvu',
      }
    };

    // Open dialog with the extended configuration
    this.ref = this.dialogService.open(FormServicesComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIDichvu + "/" + id)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);

        },
        (error) => {
        }
      );
  }
}
