import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common'; 
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { DataService } from '../../../core/services/data.service';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, ButtonModule],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [DatePipe]
})
export class AddVehicleComponent implements OnInit {
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
      name: [null, Validators.required],
      image: [null],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.preview_upload = this.stringurl + "/" + data.image;
      this.form.patchValue({
        name: data?.name,
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
    // Kiểm tra xem EditData có tồn tại và có thuộc tính image
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
    this.item.status = true;
    this.item.name = values.name;
    this._dataService.post(StringAPI.APIShip, this.item)
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
      this.item.status = values.status;
      this.item.name = values.name;
      this._dataService.put(StringAPI.APIShip + "/" + this.EditData.id, this.item)
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
    this.router.navigate(['/vehicle']);
  }
}
