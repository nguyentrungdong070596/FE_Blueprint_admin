import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DataService } from '../../../core/services/data.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-pilot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, ButtonModule],
  templateUrl: './add-pilot.component.html',
  styleUrls: ['./add-pilot.component.scss'],
  providers: [DatePipe]
})
export class AddPilotComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  uploadImage: any;
  preview_upload: any;
  stringurl: any;
  fileToUpload: File | null = null;
  selectedFile: File | null = null;

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
      rank: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.form.patchValue({
        name: data?.name,
        rank: data?.rank,
        status: data?.status,
      });
    }
    else {
      this.isEditMode = false;
    }
  }
  handleFileInput(values: any) {
    const processSave = () => {
      if (this.isEditMode) {
        console.log("Edit Mode");
        this.onEdit(values);
      } else {
        this.onInsert(values);
      }
      this.goBack();
    };

    if (this.uploadImage && this.uploadImage.length > 0) {
      this.fileToUpload = this.uploadImage[0];
      if (this.fileToUpload) {
        this._uploadService.postFile(this.fileToUpload).subscribe(
          (data: any) => {
            this.item.image = data.file_save_url;
            processSave();
          },
          (error: any) => {
            console.error('Error uploading file:', error);
          }
        );
        return; // Dừng ở đây nếu đã upload ảnh mới
      }
    }

    // Nếu không có ảnh mới thì dùng ảnh đã tồn tại hoặc ảnh mặc định
    this.item.image = this.EditData.image || "upload/files/default.png";
    processSave();
  }


  goBack(): void {
    this.router.navigate(['/pilot']);
  }

  onFileSelected(event: any) {
    this.uploadImage = event.target.files; // Capture the FileList object
    if (this.uploadImage && this.uploadImage.length > 0) {
      const file = this.uploadImage[0];
      const reader = new FileReader();
      reader.onload = e => this.preview_upload = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(values: any) {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    
    this.handleFileInput(values)
  }

  onInsert(values: any) {
    this.item.name = values.name;
    this.item.status = true;
    this.item.rank = values.rank;
    this._dataService.post(StringAPI.APIHoaTieu, this.item)
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
      this.item.name = values.name;
      this.item.status = values.status;
      this.item.rank = values.rank;

      this._dataService.put(StringAPI.APIHoaTieu + "/" + this.EditData.id, this.item)
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
