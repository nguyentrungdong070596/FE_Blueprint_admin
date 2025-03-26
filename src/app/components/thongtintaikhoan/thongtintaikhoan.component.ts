import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
// import { DataService } from '../../services/data.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
// PrimeNG imports
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, Subscription } from 'rxjs';

import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';

import { InputIconModule } from 'primeng/inputicon';

import { DialogThongTinTaiKhoanComponent } from './dialog-thongtintaikhoan/dialog-thongtintaikhoan.component';
import { DialogAddThongTinTaiKhoanComponent } from './dialog-add-thongtintaikhoan/dialog-add-thongtintaikhoan.component';
import { DataService } from '../../core/services/data.service';
import { StringAPI } from '../../shared/stringAPI/string_api';

// import { DynamicDialogModule } from 'primeng/dynamicdialog';
interface DeleteUserResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-thongtintaikhoan',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    CommonModule,
    TabViewModule,
    DividerModule,
    DropdownModule,
    CalendarModule,
    AutoCompleteModule,
    RouterModule,
    DynamicDialogModule,
    ToastModule,
    PaginatorModule,
    InputIconModule
  ],
  providers: [DialogService, MessageService, ConfirmationService],

  templateUrl: './thongtintaikhoan.component.html',
  styleUrl: './thongtintaikhoan.component.scss'
})
export class ThongTinTaiKhoanComponent {
  dialogService = inject(DialogService);
  ref!: DynamicDialogRef;
  const_chucvus: any[] = []
  selectedConst_data!: any;
  loading: boolean = false;
  const_data: any = [];
  item: any = {};
  searchText: string = '';
  rows: number = 10;
  first: number = 0;
  totalRecords: number = 120;
  private searchTimeout: any;

  isMenuHidden: any

  constructor(private router: Router,
    private location: Location,
    private _dataService: DataService,
    private http: HttpClient,
    public messageService: MessageService,
    private confirmationService: ConfirmationService  // Inject the service

  ) { }

  private layoutSubscription: Subscription | null = null; // Khởi tạo với giá trị null
  isOpen!: boolean //khai bao gia tri tắt mở cho bộ lọc

  ngOnInit(): void {
    this.isOpen = true;



    this.loadData(this.first, this.rows)

  }
  onRowInsertInit() {
    this.ref = this.dialogService.open(DialogAddThongTinTaiKhoanComponent, {
      data: {},
      header: 'Thêm mới',
      width: '60%',
      height: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
    this.ref.onClose.subscribe((product: any) => {
      this.loadData(this.first, this.rows);
    });
  }
  onRowEditInit(products: any) {
    this.ref = this.dialogService.open(DialogThongTinTaiKhoanComponent, {
      data: products,
      header: 'Chi tiết Thông tin tài khoản',
      width: '60%',
      height: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
    this.ref.onClose.subscribe((product: any) => {
      // cập nhật lại ds
      this.loadData(this.first, this.rows);
    });
  }

  onDeleteUser(userId: string) {
    // Show browser's default confirmation dialog
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');

    if (isConfirmed) {
      // If user clicks "Yes", proceed with deletion
      this._dataService.delete(`${StringAPI.ApiUser}/${userId}`).subscribe(
        (response: any) => {
          if (response?.success) {
            // Handle successful response
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response?.message,  // Display success message from the response
            });

            // Optionally, remove the user from the local list to update the UI
            this.const_data = this.const_data.filter((user: any) => user.Id !== userId);
          }
        },
        (error) => {
          // Handle error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Không thể xóa được user này',  // Display error message
          });
        }
      );
    } else {
      // If user clicks "No" or cancels, show a cancel message (optional)
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Xóa người dùng đã bị hủy bỏ',  // Message when action is cancelled
      });
    }
  }
  loadData(first: number, rows: number) {
    this.loading = true;
    this.item.limit = rows;
    this.item.name = this.searchText ?? "undefined";
    this.item.page = (first / rows) + 1;
    this._dataService.getSearchLimitName(`${StringAPI.ApiUser}/`, this.item).subscribe(res => {
      this.setValueObject(res || []);
    });
  }
  setValueObject(values: any) {
    this.const_data = values.data;
    this.totalRecords = values.totalRecords || 0;
    this.loading = false;
  }

  search(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout); // Xoá timeout trước đó nếu có
    }
    // Tạo timeout mới để gọi API sau 300ms (hoặc thời gian bạn muốn)
    this.searchTimeout = setTimeout(() => {
      this.loading = true;
      this.item.name = query;
      this._dataService.getSearchLimitName(`${StringAPI.ApiUser}/`, this.item).pipe(
        catchError(error => {
          //console.error('API error:', error);
          return of({ data: [] });
        })
      ).subscribe((res: any) => {
        this.loading = false;
        if (res.data != null) {
          this.const_data = res.data;
        } else {
          this.const_data = [];
        }
      }, (error) => {
        this.loading = false;
        //console.error('Subscription error:', error);
      });
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
    this.loadData(this.first, this.rows);
  }

}








