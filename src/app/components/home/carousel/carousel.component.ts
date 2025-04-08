import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../../environment/environment';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { DataService } from '../../../core/services/data.service';
import { FormComponent } from '../../../shared/components/form/form.component';
import { PaginatorModule } from 'primeng/paginator';
import { FormCarouselComponent } from '../../../shared/components/form-carousel/form-carousel.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [ButtonModule, CommonModule, ToastModule,
    RouterModule, ImageModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  providers: [DialogService, MessageService, ConfirmationService]
})
export class CarouselComponent {
  loading: boolean = false;

  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService, private router: Router, private _dataService: DataService,
    private route: ActivatedRoute, private messageService: MessageService, private service: MessageService

  ) { }

  ngOnInit(): void {
    this.getItems(this.limit, this.rows);

    this.route.queryParams.subscribe(params => {
      console.log("Query Params nhận được:", params); // Kiểm tra log
      if (params['welcome'] === 'true') {
        setTimeout(() => {
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Welcome Admin',
          //   detail: 'Đăng nhập thành công!',
          //   life: 3000
          // });
          this.messageService.add({ severity: 'success', summary: 'ĐĂNG NHẬP THÀNH CÔNG', detail: 'NGÀY MỚI VUI VẺ !' });
        }, 500);
      }
    });
  }
  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this.item.itemType = '0';
    this._dataService.GetItem(`${StringAPI.APICarousel}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((service: any) => ({
        id: service.id,
        image: service.image,
        status: service.status,
      }));
      //consolethis.const_data);
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
          image: item?.image,
          status: item?.status,
        },
        fields: [
          { name: 'image', required: true },
          { name: 'status', required: true },
        ],
        item_type: 'banner',
      }
    };

    // Open dialog with the extended configuration
    this.ref = this.dialogService.open(FormCarouselComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APICarousel + "/" + id)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);

        },
        (error) => {
        }
      );
  }
}
