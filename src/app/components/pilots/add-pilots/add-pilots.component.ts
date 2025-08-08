import { CommonModule, DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { QuillModule } from "ngx-quill";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { environment } from "../../../../environment/environment";
import { DataService } from "../../../core/services/data.service";
import { FileUploadService } from "../../../core/services/uploadFiles/file-upload.service";
import { StringAPI } from "../../../shared/stringAPI/string_api";
import { SafeResourceUrl } from "@angular/platform-browser";
import { FileViewerComponent } from "./view-file/file-viewer.component";

@Component({
  selector: "app-add-pilots",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonModule, FileViewerComponent],
  templateUrl: "./add-pilots.component.html",
  styleUrl: "./add-pilots.component.scss",
  providers: [DatePipe],
})
export class AddPilotsComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;

  @Input() fileUrl!: string;
  safeUrl!: SafeResourceUrl;
  fileType = '';
  textContent = '';
  googleViewerUrl = '';

  preview_upload: any;
  preview_upload2: any;
  uploadImage: any;
  uploadImage2: any;

  ranks = [
    {
      name: "Hoa tiêu ngoại hạng",
      value: "Hoa tiêu ngoại hạng",
    },
    {
      name: "Hoa tiêu hạng nhất",
      value: "Hoa tiêu hạng nhất",
    },
    {
      name: "Hoa tiêu hạng hai",
      value: "Hoa tiêu hạng hai",
    },
    {
      name: "Hoa tiêu hạng ba",
      value: "Hoa tiêu hạng ba",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.EditData = this.config.data;
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  createForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      image: [null],
      image2: [null],
      rank: [null, Validators.required],
      sort: [null, Validators.required],
      content: [null],
      content_en: [null],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.preview_upload = this.stringurl + "/" + data.image;
      this.preview_upload2 = this.stringurl + "/" + data.image2; // ✅ THÊM DÒNG NÀY
      this.form.patchValue({
        name: data?.name,
        rank: data?.rank,
        sort: data?.sort,

        content: data?.content,
        content_en: data?.content_en,
        status: data?.status,
      });

      this.item.image = this.EditData.image;
      this.item.image2 = this.EditData.image2;
      this.form.controls["image"].clearValidators();
      this.form.controls["image"].updateValueAndValidity();
      this.form.controls["image2"].clearValidators();
      this.form.controls["image2"].updateValueAndValidity();
    } else {
      this.isEditMode = false;
    }
  }

  onFileSelectedImage1(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadImage = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.preview_upload = e.target?.result;
      };
      reader.readAsDataURL(this.uploadImage);
    }
  }

  onFileSelectedImage2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadImage2 = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.preview_upload2 = e.target?.result;
      };
      reader.readAsDataURL(this.uploadImage2);
    }
  }

  async handleFileInput() {
    if (!this.uploadImage) {
      // Nếu không có hình, vẫn xóa validator (nếu cần)
      this.form.controls["image"].clearValidators();
      this.form.controls["image"].updateValueAndValidity();
      return;
    }
    try {
      if (this.uploadImage) {
        const imageData = await this._uploadService.postFile(this.uploadImage);
        if (imageData.file_save_url) {
          // Loại bỏ validator của trường image nếu upload thành công
          this.form.controls["image"].clearValidators();
          this.form.controls["image"].updateValueAndValidity();
          this.item.image = imageData.file_save_url;
        }
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }

  async handleFileInput2() {
    if (!this.uploadImage2) {
      // Nếu không có hình, vẫn xóa validator (nếu cần)
      this.form.controls["image2"].clearValidators();
      this.form.controls["image2"].updateValueAndValidity();
      return;
    }

    try {
      const imageData = await this._uploadService.postFile(this.uploadImage2);
      if (imageData.file_save_url) {
        this.form.controls["image2"].clearValidators();
        this.form.controls["image2"].updateValueAndValidity();
        this.item.image2 = imageData.file_save_url;
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }

  async onSubmit(values: any) {
    await this.handleFileInput();
    await this.handleFileInput2();

    // Kiểm tra lại form sau khi xử lý file
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.onEdit(values);
    } else {
      this.onInsert(values);
    }
  }

  onInsert(values: any) {
    this.item.status = true;
    this.item.rank = values.rank;
    this.item.name = values.name;

    this.item.content = values.content;
    this.item.content_en = values.content_en;
    this.item.sort = values.sort;

    this._dataService.post(StringAPI.APIHoaTieu, this.item).subscribe(
      (res) => {
        this.ref.close(res || []);
      },
      (error) => { },
    );
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      this.item.status = values.status;
      this.item.rank = values.rank;
      this.item.name = values.name;
      this.item.content = values.content;
      this.item.content_en = values.content_en;
      this.item.sort = values.sort;
      this._dataService
        .put(StringAPI.APIHoaTieu + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.ref.close(res || []);
          },
          (error) => { },
        );
    }
  }
}
