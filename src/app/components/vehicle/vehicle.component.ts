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
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [DynamicDialogModule, CommonModule, RouterModule, FormsModule, QuillModule, PaginatorModule, ImageModule],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  providers: [DialogService]
})
export class VehicleComponent {
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
    this.getPilotItems(this.limit, this.rows);
  }
  getPilotItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIShip}`, this.item).subscribe(res => {
      this.setPilotItems(res || []);
    });
  }
  setPilotItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((ship: any) => ({
        id: ship.id,
        name: ship.name,
        image: ship.image,
        status: ship.status,

      }));
      this.totalRecords = values.totalRecords;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.getPilotItems(this.first, this.rows);
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
        name: item.name,
        image: item.image,
        status: item.status,
      };
    }
    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddVehicleComponent, dialogConfig);
  }
  deleteItem(item: any) {
    // console.log(item);
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIShip + "/" + id)
      .subscribe(
        (res) => {

          this.router.navigate(['/vehicle']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
        }
      );
  }
  onAdd(): void {
    this._dataService.setData(null);
  }
}

