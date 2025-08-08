import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { QuillModule } from "ngx-quill";
import {
  DynamicDialogModule,
  DialogService,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { PaginatorModule } from "primeng/paginator";
import { environment } from "../../../environment/environment";
import { DataService } from "../../core/services/data.service";
import { StringAPI } from "../../shared/stringAPI/string_api";
import { AddPilotsComponent } from "./add-pilots/add-pilots.component";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { ButtonModule } from "primeng/button";
@Component({
  selector: "app-pilots",
  standalone: true,
  imports: [
    DynamicDialogModule,
    CommonModule,
    RouterModule,
    FormsModule,
    QuillModule,
    PaginatorModule,
    ImageModule,
    InputIconModule,
    InputIconModule,
    ButtonModule,
  ],
  templateUrl: "./pilots.component.html",
  styleUrl: "./pilots.component.scss",
  providers: [DialogService],
})
export class PilotsComponent {
  urlAPI = environment.apiUrl;
  item: any = {};
  const_data: any = [];
  totalRecords: number = 0;
  rows: number = 5;
  first: number = 0;
  limit: number = 0;
  loading: boolean = false;

  searchText: string = "";
  private searchTimeout: any;

  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    private router: Router,
    private _dataService: DataService,
  ) {}
  ngOnInit(): void {
    this.getPilotItems(this.limit, this.rows);
  }
  getPilotItems(first: number, rows: number): void {
    this.item.limit = rows;
    this.item.page = first / rows + 1;
    this.item.name = this.searchText ?? "undefined";
    this._dataService
      .GetItem(`${StringAPI.APIHoaTieu}`, this.item)
      .subscribe((res) => {
        this.setPilotItems(res || []);
      });
  }
  setPilotItems(values: any): void {
    if (values.success && values.data) {
      this.const_data = values.data.map((pilot: any) => ({
        id: pilot.id,
        name: pilot.name,
        rank: pilot.rank,
        image: pilot.image,
        sort: pilot.sort,
        content: pilot.content,
        content_en: pilot.content_en,
        status: pilot.status,
      }));
      this.totalRecords = values.totalRecords;
    }
  }

  search(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout); // Xoá timeout trước đó nếu có
    }
    this.searchTimeout = setTimeout(() => {
      this.loading = true;
      this.searchText = query;
      this.first = 0;
      this.getPilotItems(this.first, this.rows);
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
    this.getPilotItems(this.first, this.rows);
  }

  show(item: any) {
    const dialogConfig: any = {
      width: "80vw",
      modal: true,
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
    };

    // Kiểm tra nếu có item, thì thêm dữ liệu vào
    if (item) {
      dialogConfig.data = {
        id: item.id,
        name: item.name,
        rank: item.rank,
        image: item.image,
        sort: item.sort,
        content: item.content,
        content_en: item.content_en,
        status: item.status,
      };
    }
    // Mở dialog với cấu hình đã định nghĩa
    this.ref = this.dialogService.open(AddPilotsComponent, dialogConfig);
    this.ref.onClose.subscribe(() => {
      this.getPilotItems(this.first, this.rows);
    });
  }
  deleteNews(item: any) {
    this.OnDelete(item.id);
  }

  OnDelete(id: any) {
    this._dataService.delete(StringAPI.APIHoaTieu + "/" + id).subscribe(
      (res) => {
        this.getPilotItems(this.first, this.rows);
      },
      (error) => {},
    );
  }
}
