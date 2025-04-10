import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../environment/environment';
import { DataService } from '../../core/services/data.service';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { FormFooterComponent } from '../../shared/components/form-footer/form-footer.component';

@Component({
  selector: 'app-footer-management', // Đổi từ header thành footer
  standalone: true,
  imports: [ButtonModule, CommonModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './footer.component.html', // Đổi tên file template
  styleUrl: './footer.component.scss', // Đổi tên file style
  providers: [DialogService]
})


// QUẢN LÝ FOOTER
export class FooterComponent { // Đổi tên class từ HeaderComponent thành FooterComponent
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
    this._dataService.GetItem(`${StringAPI.APIFooter}`, this.item).subscribe(res => { // Đổi APIHeader thành APIFooter
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
        // company_name: item?.company_name,
        address: item?.address,
        fax: item?.fax,
        mst: item?.mst,
        email: item?.email,
        number_phone: item?.number_phone,
        branch_name: item?.branch_name,
        linkfb: item?.linkfb
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
          // company_name: item?.company_name,
          address: item?.address,
          fax: item?.fax,
          mst: item?.mst,
          email: item?.email,
          number_phone: item?.number_phone,
          branch_name: item?.branch_name,
          linkfb: item?.linkfb

        },
        fields: [
          // { name: 'company_name', required: true },
          { name: 'address', required: true },
          { name: 'fax', required: false },
          { name: 'mst', required: false },
          { name: 'email', required: true },
          { name: 'number_phone', required: true },
          { name: 'branch_name', required: false },
          { name: 'linkfb', required: false }
        ]
      }
    };

    this.ref = this.dialogService.open(FormFooterComponent, dialogConfig); // Có thể cần đổi thành FormFooterComponent
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIFooter + "/" + id) // Đổi APIHeader thành APIFooter
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