import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StringAPI } from '../../shared/stringAPI/string_api';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../environment/environment';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddMonnuocComponent } from './add-monnuoc/add-monnuoc.component';



@Component({
  selector: 'app-monnuoc',
  standalone: true,
  imports: [DynamicDialogModule, PdfViewerModule, RouterModule, CommonModule],
  templateUrl: './monnuoc.component.html',
  styleUrls: ['./monnuoc.component.scss'],
  providers: [DialogService]
})
export class MonnuocComponent {
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
    this.getItems(this.limit, this.rows);
  }
  getItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = (first / rows) + 1;
    this._dataService.GetItem(`${StringAPI.APIManeuveringDraft}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item.id,
        dataurl: item.dataurl,
        status: item.status,
        postdate: item.postdate,
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
      }
    };

    // Kiểm tra nếu có item, thì thêm dữ liệu vào
    if (item) {
      dialogConfig.data = {
        id: item.id,
        dataurl: item.dataurl,
        status: item.status,
        postdate: item.postdate,
      };
    }

    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddMonnuocComponent, dialogConfig);
  }
  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {

    this._dataService.delete(StringAPI.APIManeuveringDraft + "/" + id)
      .subscribe(
        (res) => {
          this.router.navigate(['/monnuoc']).then(() => {
            window.location.reload(); // Load lại trang
          });
        },
        (error) => {
        }
      );
  }
}
