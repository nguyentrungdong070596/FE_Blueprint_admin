import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../../environment/environment';
import { DataService } from '../../../core/services/data.service';
import { FormComponent } from '../../../shared/components/form/form.component';
import { StringAPI } from '../../../shared/stringAPI/string_api';

@Component({
  selector: 'app-executive-text',
  standalone: true,
  imports: [ButtonModule, CommonModule, ImageModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './executive-text.component.html',
  styleUrl: './executive-text.component.scss',
  providers: [DialogService]
})
export class ExecutiveTextComponent {

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
    this.item.itemType = '10';
    this._dataService.GetItem(`${StringAPI.APIItems}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item?.id,
        title: item?.title,
        // image: item?.image,
        // content: item?.content,
        // postdate: item?.postdate,
        status: item?.status,
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
          title: item?.title,
          // image: item?.image,
          // content: item?.content,
          // postdate: item?.postdate,
          status: item?.status,
        },
        fields: [
          // { name: 'image', required: true },
          { name: 'title', required: true },
          // { name: 'content', required: true },
          // { name: 'postdate', required: false },
          { name: 'status', required: true },
        ],
        item_type: 'link-dathangdichvu',
      }
    };

    // Open dialog with the extended configuration
    this.ref = this.dialogService.open(FormComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getItems(this.first, this.rows);
    });
  }

  deleteItem(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIItems + "/" + id)
      .subscribe(
        (res) => {
          this.getItems(this.first, this.rows);

        },
        (error) => {
        }
      );
  }

}
