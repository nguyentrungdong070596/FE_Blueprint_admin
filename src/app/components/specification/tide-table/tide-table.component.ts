import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../../environment/environment';
import { DataService } from '../../../core/services/data.service';
import { FormComponent } from '../../../shared/components/form/form.component';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FormTideComponent } from '../../../shared/components/form-tide/form-tide.component';

@Component({
  selector: 'app-tide-table',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, ImageModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './tide-table.component.html',
  styleUrl: './tide-table.component.scss',
  providers: [DialogService]
})
export class TideTableComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;
  stringUrl = environment.apiUrl + '/';
  loading: boolean = false;

  searchText: string = '';
  private searchTimeout: any;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService, private router: Router, private _dataService: DataService) { }

  ngOnInit(): void {
    this.getItems(this.limit, this.rows);
  }
  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this.item.itemType = '16';
    this.item.name = this.searchText ?? "undefined";

    this._dataService.GetItem(`${StringAPI.APITide}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((service: any) => ({
        id: service.id,
        pdfurl: service.pdfurl,
        title: service.title,
        postdate: service?.postdate,
        status: service.status,
      }));
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
          pdfurl: item?.pdfurl,
          postdate: item?.postdate,
          title: item?.title,
          status: item?.status,
        },
        fields: [
          { name: 'pdfurl', required: true },
          { name: 'postdate', required: true },
          { name: 'title', required: true },
          { name: 'status', required: true },
        ],
        item_type: 'thuytrieu',
      }
    };

    // Open dialog with the extended configuration
    this.ref = this.dialogService.open(FormTideComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APITide + "/" + id)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);
        },
        (error) => {
        }
      );
  }
}
