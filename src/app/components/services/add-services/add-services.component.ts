import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DataService } from '../../../core/services/data.service';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environment/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, PdfViewerModule, ButtonModule],
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss'],
  providers: [DatePipe]
})
export class AddServicesComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;


  uploadImage: any;
  preview_upload: any;
  selectedPdfFile: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) { this.EditData = this.config.data }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  createForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
      pdfdata: [null, Validators.required],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.preview_upload = this.stringurl + "/" + data.image;
      this.form.patchValue({
        title: data?.title,
        status: data?.status,
      });
      this.item.pdfdata = this.EditData.pdfdata;
      this.form.controls['pdfdata'].clearValidators();
      this.form.controls['pdfdata'].updateValueAndValidity();
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

  onFilePDFSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
    }
  }
  async handleFileInput() {
    if (this.selectedPdfFile) {
      const Pdfdata = await this._uploadService.postFile(this.selectedPdfFile);
      this.form.controls['pdfdata'].clearValidators();
      this.form.controls['pdfdata'].updateValueAndValidity();
      this.item.pdfdata = Pdfdata.file_save_url;
    }
    if (this.uploadImage) {
      const imageData = await this._uploadService.postFile(this.uploadImage);
      if (imageData.file_save_url) {
        this.form.controls['image'].clearValidators();
        this.form.controls['image'].updateValueAndValidity();
        this.item.image = imageData.file_save_url;
      }
    }
  }

  async onSubmit(values: any) {
    await this.handleFileInput();

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.item.title = values.title;
    this.item.status = true;
    this._dataService.post(StringAPI.APIServicePrice, this.item)
      .subscribe(
        (res) => {
          this.router.navigate(['/services']).then(() => {
            window.location.reload(); // Load lại trang
          });
        },
        (error) => {
        }
      );
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      // console.log(values);
      this.item.title = values.title;
      this.item.status = values.status;
      this._dataService.put(StringAPI.APIServicePrice + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.router.navigate(['/services']).then(() => {
              window.location.reload(); // Load lại trang
            });
          },
          (error) => {
          }
        );
    }
  }
}
