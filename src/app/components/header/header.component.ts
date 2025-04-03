import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../environment/environment';
import { DataService } from '../../core/services/data.service';
import { FormHeaderComponent } from '../../shared/components/form-header/form-header.component';
import { StringAPI } from '../../shared/stringAPI/string_api';


@Component({
  selector: 'app-header-management',
  standalone: true,
  imports: [ButtonModule, CommonModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [DialogService]
})
// QUẢN LÝ HEADER
export class HeaderComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  ref: DynamicDialogRef | undefined;
  loading: boolean = false;

  searchText: string = '';
  private searchTimeout: any;

  constructor(public dialogService: DialogService, private router: Router, private _dataService: DataService) { }

  ngOnInit(): void {
    this.getItems(this.limit, this.rows);
  }

  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this.item.name = this.searchText ?? "undefined";
    this._dataService.GetItem(`${StringAPI.APIHeader}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }

  search(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
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

  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item?.id,
        company_name: item?.company_name,
        address: item?.address,
        fax: item?.fax,
        email: item?.email,
        number_phone: item?.number_phone,
        branch_name: item?.branch_name
      }));
      this.totalRecords = values.totalRecords;
    }
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
          company_name: item?.company_name,
          address: item?.address,
          fax: item?.fax,
          email: item?.email,
          number_phone: item?.number_phone,
          branch_name: item?.branch_name
        },
        fields: [
          { name: 'company_name', required: true },
          { name: 'address', required: true },
          { name: 'fax', required: false },
          { name: 'email', required: true },
          { name: 'number_phone', required: true },
          { name: 'branch_name', required: false }
        ]
      }
    };

    this.ref = this.dialogService.open(FormHeaderComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIHeader + "/" + id)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);
        },
        (error) => {
          console.error('Delete error:', error);
        }
      );
  }
}