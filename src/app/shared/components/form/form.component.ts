import { Component } from '@angular/core';
import { StringAPI } from '../../stringAPI/string_api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environment/environment';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, PdfViewerModule, ButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;
  preview_upload: any;
  uploadImage: any;
  selectedPdfFile: any;
  type_item: any = [
    {
      id: 0,
      name: "banner",
    },
    {
      id: 1,
      name: "news"
    },
    {
      id: 2,
      name: "dichvu"
    },
    {
      id: 3,
      name: "thungo"
    },
    {
      id: 4,
      name: "nhiemvu"
    },
    {
      id: 5,
      name: "lanhdao"
    },
    {
      id: 6,
      name: "tochuc"
    },
    {
      id: 7,
      name: "luocsu"
    },
    {
      id: 8,
      name: "tintuc"
    },
    {
      id: 9,
      name: "thongbao"
    },
    {
      id: 10,
      name: "vanban"
    },
    {
      id: 11,
      name: "thamkhao"
    },
    {
      id: 12,
      name: "monnuoc"
    },
    {
      id: 13,
      name: "giadichvu"
    },
    {
      id: 14,
      name: "hoatieu"
    },
  ]
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.EditData = this.config.data.itemData;
    console.log(this.EditData);
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  showField(fieldName: string): boolean {
    return this.config.data.fields.some((field: { name: string }) => field.name === fieldName);
  }

  createForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.config.data.fields.forEach((field: any) => {
      if (field.name == 'status') {
        formGroupConfig['status'] = [true, Validators.required];
      }
      else {
        formGroupConfig[field.name] = [null, Validators.required];
      }
    });
    this.form = this.fb.group(formGroupConfig);
  }

  setValueFormEdit(data: any) {
    if (data && data.id) {
      const formData: any = {};
      this.config.data.fields.forEach((field: any) => {
        formData[field.name] = data[field.name];
      });
      this.form.patchValue(formData);
      this.preview_upload = this.stringurl + '/' + data.image;
    } else {
      this.isEditMode = false;
    }
  }

  onFilePDFSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
      input.value = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.uploadImage = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.preview_upload = e.target?.result;
        // Optionally set a different form control if you want to track the image URL
        this.form.controls['image'].setValue(this.uploadImage.name); // or whatever value you want to store
      };
      reader.readAsDataURL(this.uploadImage);

      input.value = '';
    }
  }

  async handleFileInput() {
    if (this.selectedPdfFile) {
      const pdfurl = await this._uploadService.postFile(this.selectedPdfFile);
      if (pdfurl) {
        this.form.controls['pdfurl'].clearValidators();
        this.form.controls['pdfurl'].updateValueAndValidity();
        this.item.pdfurl = pdfurl.file_save_url;
      }
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
    this.item.status = true;
    const item_type = this.type_item.find((i: any) => i.name === this.config.data.item_type);
    if (item_type) {
      this.item.itemtype = item_type.id.toString();
      Object.keys(values).forEach(key => {
        if (key !== 'image' && key !== 'pdfurl') {
          this.item[key] = values[key];
        }
      });
      this._dataService.post(StringAPI.APIItems, this.item)
        .subscribe(
          (res) => {
            this.ref.close(res || []);
          },
          (error) => {
          }
        );

    }
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      Object.keys(values).forEach(key => {
        if (key !== 'image' && key !== 'pdfurl') {
          this.item[key] = values[key];
        }
      });
      this._dataService.put(StringAPI.APIItems + "/" + this.EditData.id, this.item)
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
