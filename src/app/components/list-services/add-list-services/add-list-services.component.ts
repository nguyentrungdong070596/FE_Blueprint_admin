import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { DataService } from '../../../core/services/data.service';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environment/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-list-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, PdfViewerModule, ButtonModule],
  templateUrl: './add-list-services.component.html',
  styleUrls: ['./add-list-services.component.scss'],
  providers: [DatePipe]
})
export class AddListServicesComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;
  preview_upload: any;
  uploadImage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.EditData = this.config.data
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  createForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      content: [null],
      image: [null, Validators.required],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.preview_upload = this.stringurl + "/" + data.image;
      this.form.patchValue({
        status: data?.status,
        title: data?.title,
        content: data?.content,
      });
      this.item.image = this.EditData.image;
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].updateValueAndValidity();
    }
    else {
      this.isEditMode = false;
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.uploadImage = input.files[0];


      // Đọc file hình ảnh để tạo preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.preview_upload = e.target?.result;
      };
      reader.readAsDataURL(this.uploadImage);
    }
  }

  async handleFileInput() {
    if (this.uploadImage) {
      const imageData = await this._uploadService.postFile(this.uploadImage);
      if (imageData.file_save_url) {
        // Loại bỏ validator của trường image nếu upload thành công
        this.form.controls['image'].clearValidators();
        this.form.controls['image'].updateValueAndValidity();
        this.item.image = imageData.file_save_url;
      }
    }
  }

  async onSubmit(values: any) {
    await this.handleFileInput();

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
    this.item.content = values.content;
    this.item.title = values.title;
    this._dataService.post(StringAPI.APIDichvu, this.item)
      .subscribe(
        (res) => {
          this.ref.close(res || []);
        },
        (error) => {
        }
      );

  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      this.item.status = values.status;
      this.item.content = values.content;
      this.item.title = values.title;
      this._dataService.put(StringAPI.APIDichvu + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.ref.close(res || []);
          },
          (error) => {
          }
        );

    }
  }
}




























