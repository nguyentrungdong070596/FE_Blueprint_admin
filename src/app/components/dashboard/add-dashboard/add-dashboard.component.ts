import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DataService } from '../../../core/services/data.service';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-add-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss']
})
export class AddDashboardComponent implements OnInit {
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
      image: [null, Validators.required],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.preview_upload = this.stringurl + "/" + data.image;
      this.form.patchValue({
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

  async handleFileInput() {
    // Nếu không có ảnh mới thì dùng ảnh đã tồn tại hoặc ảnh mặc định
    if ( this.EditData && this.EditData.image) {
      this.item.image = this.EditData.image
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].updateValueAndValidity();
    }
    else{
      this.item.image = "upload/files/default.png"
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
      this.onInsert();
    }

    this.goBack();
  }


  onInsert() {
    this.item.status = true;
    this._dataService.post(StringAPI.APICarousel, this.item)
      .subscribe(
        (res) => {
          console.log('News added successfully:', res);
        },
        (error) => {
          console.error('Error adding news:', error);
        }
      );

  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      this.item.status = values.status;

      this._dataService.put(StringAPI.APICarousel + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            console.log('News update successfully:', res);
          },
          (error) => {
            console.error('Error update news:', error);
          }
        );

    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}


