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
  ) { }

  ngOnInit(): void {
    this.createForm();
    this._dataService.data$.subscribe(data => {
      this.EditData = data;
      this.setValueFormEdit(data);
    });
  }

  createForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      image: [null],
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
    // Upload Pdf
    if (this.EditData && this.EditData.pdfdata) {
      this.item.pdfdata = this.EditData.pdfdata;
      this.form.controls['pdfdata'].clearValidators();
      this.form.controls['pdfdata'].updateValueAndValidity();
    } else {
      this.item.pdfdata = "";
    }

    if (this.selectedPdfFile) {
      const Pdfdata = await this._uploadService.postFile(this.selectedPdfFile);
      this.form.controls['pdfdata'].clearValidators();
      this.form.controls['pdfdata'].updateValueAndValidity();
      this.item.pdfdata = Pdfdata.file_save_url;
    }

    // Upload hình ảnh
    if (this.EditData && this.EditData.image) {
      this.item.image = this.EditData.image;
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].updateValueAndValidity();
    } else {
      this.item.image = "upload/files/default.png";
    }

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

    this.goBack();
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
          console.log('added successfully:', res);
        },
        (error) => {
          console.error('Error adding:', error);
        }
      );
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      console.log(values);
      this.item.title = values.title;
      this.item.status = values.status;
      this._dataService.put(StringAPI.APIServicePrice + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            console.log('update successfully:', res);
          },
          (error) => {
            console.error('Error update:', error);
          }
        );

    }
  }

  goBack(): void {
    this.router.navigate(['/services']);
  }
}
