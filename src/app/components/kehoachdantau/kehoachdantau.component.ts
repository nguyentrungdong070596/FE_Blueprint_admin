import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { environment } from '../../../environment/environment';
import { DataService } from '../../core/services/data.service';
import { FormKeHoachDanTauComponent } from '../../shared/components/form-kehoachdantau/form-kehoachdantau.component';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-kehoachdantau',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ImageModule,
    DynamicDialogModule,
    PaginatorModule,
    TabViewModule,
    InputSwitchModule
  ],
  templateUrl: './kehoachdantau.component.html',
  styleUrl: './kehoachdantau.component.scss',
  providers: [DialogService]
})
export class KehoachdantauComponent implements OnInit {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  loading: boolean = false;
  searchText: string = '';
  selectedDate: string = '';
  currentTab: string = 'v';
  private searchTimeout: any;

  ref: DynamicDialogRef | undefined;

  toggleStatus: boolean = false; // Trạng thái switch

  constructor(
    private http: HttpClient,
    public dialogService: DialogService,
    private router: Router,
    private _dataService: DataService
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = this.formatDate(today.toISOString());
    this.getItems(this.limit, this.rows);
    this.getSwitchStatus(); // Lấy trạng thái ban đầu của switch
  }

  // Lấy trạng thái switch từ API
  getSwitchStatus() {
    this.http.get(`${this.urlAPI}/switch/1`).subscribe({ // Giả sử ID mặc định là 1
      next: (response: any) => {
        if (response.success && response.data) {
          this.toggleStatus = response.data.flag; // Lấy giá trị flag từ response

        }
      },
      error: (error) => {
        console.error('Failed to get switch status:', error);
      }
    });
  }

  // Gọi API khi toggle thay đổi
  toggleApiCall() {
    const previousStatus = this.toggleStatus; // Lưu trạng thái trước khi gọi API
    const payload = { flag: this.toggleStatus };

    this.http.put(`${this.urlAPI}/switch/1`, payload).subscribe({ // Giả sử ID mặc định là 1
      next: (response: any) => {
        if (response.success) {

        } else {
          this.toggleStatus = previousStatus; // Rollback nếu không thành công
        }
      },
      error: (error) => {
        console.error('Toggle API call failed:', error);
        this.toggleStatus = previousStatus; // Rollback nếu lỗi
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this.item.name = this.searchText;
    this.item.ngay = this.selectedDate;
    this.item.dendoi = this.currentTab;
    this._dataService.GetItem(`${StringAPI.APIKehoachdantau}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }

  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item?.id,
        name: item?.name,
        country: item?.country,
        agency: item?.agency,
        dwt: item?.dwt,
        grt: item?.grt,
        loa: item?.loa,
        draft: item?.draft,
        fromkh: item?.fromkh,
        tokh: item?.tokh,
        pob: item?.pob,
        nameHT: item?.nameHT,
        rangeHT: item?.rangeHT,
        itemtype: item?.itemtype,
        postdate: item?.postdate
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getItems(this.first, this.rows);
  }

  getItemTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'dc': 'Tàu Dịch chuyển',
      'r': 'Tàu Rời',
      'v': 'Tàu Đến'
    };
    return types[type] || 'Không xác định';
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

  filterByDate(): void {
    this.first = 0;
    this.getItems(this.first, this.rows);
  }

  onTabChange(event: any): void {
    const tabMapping: { [key: number]: string } = {
      0: 'v',
      1: 'r',
      2: 'dc'
    };
    this.currentTab = tabMapping[event.index];
    this.first = 0;
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
          name: item?.name,
          country: item?.country,
          agency: item?.agency,
          dwt: item?.dwt,
          grt: item?.grt,
          loa: item?.loa,
          draft: item?.draft,
          fromkh: item?.fromkh,
          tokh: item?.tokh,
          pob: item?.pob,
          nameHT: item?.nameHT,
          rangeHT: item?.rangeHT,
          itemtype: item?.itemtype,
          postdate: this.formatDate(item?.postdate)
        },
        fields: [
          { name: 'name', required: true },
          { name: 'country', required: true },
          { name: 'agency', required: true },
          { name: 'dwt', required: true },
          { name: 'grt', required: true },
          { name: 'loa', required: true },
          { name: 'draft', required: true },
          { name: 'fromkh', required: true },
          { name: 'tokh', required: true },
          { name: 'pob', required: true },
          { name: 'nameHT', required: true },
          { name: 'rangeHT', required: true },
          { name: 'itemtype', required: true },
          { name: 'postdate', required: true }
        ],
        item_type: 'kehoachdantau',
      }
    };

    this.ref = this.dialogService.open(FormKeHoachDanTauComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(`${StringAPI.APIKehoachdantau}/${id}`)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);
        },
        (error) => {
          // Handle error if needed
        }
      );
  }
}