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
  uploadImage: any;
  preview_upload: any;
  selectedPdfFile: File | null = null;
  fileToUpload: File | null = null;

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
      pdfdata: [null],
      status: [null],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.form.patchValue({
        title: data?.title,
        status: data?.status,
      });
    }
    else {
      this.isEditMode = false;
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Kiểm tra xem người dùng có chọn tệp hay không
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];  // Lấy tệp PDF đầu tiên từ danh sách tệp
    }
  }
  handleFileInput(values: any) {
    console.log("Đã bấm");
    let isSetValue = false;
    const processSave = () => {
      if (this.isEditMode) {
        console.log("Edit");
        this.onEdit(values);
      } else {
        this.onInsert(values);
      }
      this.goBack();
    };

    // Nếu không có ảnh mới thì dùng ảnh đã tồn tại hoặc ảnh mặc định
    this.item.image = this.EditData?.image || "upload/files/default.png";
    this.item.pdfdata = this.EditData?.pdfdata;

    // Nếu có file PDF, upload sau khi upload ảnh
    if (this.selectedPdfFile) {
      this._uploadService.postFile(this.selectedPdfFile).subscribe(
        (data: any) => {
          this.item.pdfdata = data.file_save_url;
          processSave();
        },
        (error: any) => {
          console.error('Error uploading PDF file:', error);
        }
      );
    }

    if (this.uploadImage && this.uploadImage.length > 0) {
      this.fileToUpload = this.uploadImage[0];
      if (this.fileToUpload) {
        this._uploadService.postFile(this.fileToUpload).subscribe(
          (data: any) => {
            this.item.image = data.file_save_url;
            processSave();
          },
          (error: any) => {
            console.error('Error uploading image file:', error);
          }
        );
      }
    }
    processSave();
  }



  goBack(): void {
    this.router.navigate(['/services']);
  }

  onFileSelected(event: any) {
    this.uploadImage = event.target.files;
    // if (this.uploadImage && this.uploadImage.length > 0) {
    //   const file = this.uploadImage[0];
    //   const reader = new FileReader();
    //   reader.onload = e => this.preview_upload = reader.result;
    //   reader.readAsDataURL(file);
    // }
  }

  onSubmit(values: any) {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    // console.log(values);
    this.handleFileInput(values)
  }

  onInsert(values: any) {
    this.item.title = values.title;
    this.item.status = true;
    this._dataService.post(StringAPI.APIDichvu, this.item)
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
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    if (this.EditData && this.EditData.id && values) {
      console.log(values);
      this.item.title = values.title;
      this.item.status = values.status;
      this._dataService.put(StringAPI.APIDichvu + "/" + this.EditData.id, this.item)
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
}
