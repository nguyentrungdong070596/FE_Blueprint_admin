import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FormComponent } from '../../../shared/components/form/form.component';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { environment } from '../../../../environment/environment';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [ButtonModule, CommonModule, ImageModule, DynamicDialogModule, PaginatorModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  providers: [DialogService]
})
export class NewsComponent {
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
    this.item.itemType = '1';
    this._dataService.GetItem(`${StringAPI.APIItems}`, this.item).subscribe(res => {
      this.setItems(res || []);
    });
  }
  setItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((item: any) => ({
        id: item?.id,
        title: item?.title,
        image: item?.image,
        content: item?.content,
        postdate: item?.postdate,
        status: item?.status,
      }));
      console.log(this.const_data);
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
          image: item?.image,
          content: item?.content,
          postdate: item?.postdate,
          status: item?.status,
        },
        fields: [
          { name: 'image', required: true },
          { name: 'title', required: true },
          { name: 'content', required: true },
          { name: 'postdate', required: true },
          { name: 'status', required: true },
        ],
        item_type: 'news',
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
