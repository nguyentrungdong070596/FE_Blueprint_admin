import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environment/environment';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DataService } from '../../../core/services/data.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { StringAPI } from '../../../shared/stringAPI/string_api';

@Component({
  selector: 'app-add-carousel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './add-carousel.component.html',
  styleUrl: './add-carousel.component.scss'
})
export class AddCarouselComponent {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;
  preview_upload: any;
  uploadImage: any;

  constructor(
    private fb: FormBuilder,
    private _uploadService: FileUploadService,
    private _dataService: DataService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private router: Router
  ) {
    this.EditData = this.config.data

  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  createForm() {
    this.form = this.fb.group({
      image: [null, Validators.required],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.isEditMode = true;
      this.EditData = data;
      this.preview_upload = this.stringurl + "/" + data.image;
      this.form.patchValue({
        status: data?.status,
      });
      this.item.image = data.image;
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].updateValueAndValidity();
    } else {
      this.isEditMode = false;
    }
  }

  onFileSelected(event: Event): void {
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

  async handleFileInput() {
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

  }


  onInsert() {
    this.item.status = true;
    this._dataService.post(StringAPI.APICarousel, this.item)
      .subscribe(
        (res) => {
          this.ref.close();
          this.router.navigate(['/carousel']).then(() => {
            window.location.reload(); // Load lại trang
          });
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
            this.ref.close();
            this.router.navigate(['/carousel']).then(() => {
              window.location.reload(); // Load lại trang
            });
          },
          (error) => {
            console.error('Error update news:', error);
          }
        );

    }
  }
}
