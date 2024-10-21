import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { AddCarouselComponent } from './add-carousel/add-carousel.component';
import { environment } from '../../../environment/environment';
import { DataService } from '../../core/services/data.service';
import { StringAPI } from '../../shared/stringAPI/string_api';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, ImageModule, DynamicDialogModule, AddCarouselComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  providers: [DialogService]
})
export class CarouselComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 120;
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
    this._dataService.GetItem(`${StringAPI.APICarousel}`, this.item).subscribe(res => {
      this.setDichvuItems(res || []);
    });
  }
  setDichvuItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((service: any) => ({
        id: service.id,
        image: service.image,
        status: service.status,
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
        image: item.image,
        status: item.status
      };
    }

    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddCarouselComponent, dialogConfig);
    this.ref.onClose.subscribe((product: any) => {
      this.getDichvuItems(this.first, this.rows);
    });
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APICarousel + "/" + id)
      .subscribe(
        (res) => {
          this.getDichvuItems(this.first, this.rows);

        },
        (error) => {
        }
      );
  }
}
