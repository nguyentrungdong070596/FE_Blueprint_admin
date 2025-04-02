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
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-form-kehoachdantau',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, ButtonModule],
  templateUrl: './form-kehoachdantau.component.html',
  styleUrl: './form-kehoachdantau.component.scss',
  providers: [DatePipe] // Thêm DatePipe vào providers

})
export class FormKeHoachDanTauComponent {
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
      name: "Tàu đến",
      value: "v",
    },
    {
      name: "Tàu rời",
      value: "r"
    },
    {
      name: "Tàu dịch chuyển",
      value: "dc"
    },

  ]
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private datePipe: DatePipe
  ) {
    this.EditData = this.config.data.itemData;
    // //consolethis.EditData);
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }


  showField(fieldName: string): boolean {
    return this.config.data.fields.some((field: { name: string }) => field.name === fieldName);
  }

  // createForm() {
  //   const formGroupConfig: { [key: string]: any } = {};
  //   this.config.data.fields.forEach((field: any) => {
  //     if (field.name == 'status') {
  //       formGroupConfig['status'] = [true, Validators.required];
  //     }
  //     else if (field.name === 'videourl') {
  //       formGroupConfig['videourl'] = [null]; // hoặc thêm Validator nếu muốn
  //     }
  //     else {
  //       formGroupConfig[field.name] = [null, Validators.required];
  //     }


  //   });
  //   this.form = this.fb.group(formGroupConfig);
  // }

  createForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.config.data.fields.forEach((field: any) => {
      if (field.name === 'itemtype' || field.name === 'postdate') {
        // Chỉ validate trường itemtype và postdate
        formGroupConfig[field.name] = [null, Validators.required];
      } else if (field.name === 'status') {
        // Trường status giữ nguyên logic cũ
        formGroupConfig['status'] = [true, Validators.required];
      } else if (field.name === 'videourl') {
        // Trường videourl không bắt buộc
        formGroupConfig['videourl'] = [null];
      } else {
        // Các trường khác không bắt buộc
        formGroupConfig[field.name] = [null];
      }
    });
    this.form = this.fb.group(formGroupConfig);
  }

  setValueFormEdit(data: any) {
    if (data && data.id) {
      const formData: any = {};
      // this.config.data.fields.forEach((field: any) => {
      //   formData[field.name] = data[field.name];
      // });
      this.config.data.fields.forEach((field: any) => {
        if (field.name === 'postdate' && data[field.name]) {
          // Chuyển đổi định dạng từ dd/mm/yyyy sang yyyy-MM-dd
          const [day, month, year] = data[field.name].split('/');
          formData[field.name] = `${year}-${month}-${day}`;
        } else {
          formData[field.name] = data[field.name];
        }
      });
      this.form.patchValue(formData);
      this.preview_upload = this.stringurl + '/' + data.image;
      this.preview_video = this.stringurl + '/' + data.videourl;

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
    else if (this.EditData.pdfurl) {
      this.form.controls['pdfurl'].clearValidators();
      this.form.controls['pdfurl'].updateValueAndValidity();
      this.item.pdfurl = this.EditData.pdfurl;
    }
    if (this.uploadImage) {
      const imageData = await this._uploadService.postFile(this.uploadImage);
      if (imageData.file_save_url) {
        this.form.controls['image'].clearValidators();
        this.form.controls['image'].updateValueAndValidity();
        this.item.image = imageData.file_save_url;
      }
    }
    else if (this.EditData.image) {
      this.form.controls['image'].clearValidators();
      this.form.controls['image'].updateValueAndValidity();
      this.item.image = this.EditData.image;
    }


    if (this.uploadVideo) {
      const videoData = await this._uploadService.postFileVideo(this.uploadVideo);
      if (videoData.video_url) {

        this.form.controls['videourl'].clearValidators();
        this.form.controls['videourl'].updateValueAndValidity();
        this.item.videourl = videoData.video_url;

      }
    } else if (this.EditData.videourl) {
      this.form.controls['videourl'].clearValidators();
      this.form.controls['videourl'].updateValueAndValidity();
      this.item.videourl = this.EditData.videourl;
    }
  }


  //video----------------

  uploadVideo: any;
  preview_video: any;
  ngOnDestroy(): void {
    if (this.preview_video) {
      URL.revokeObjectURL(this.preview_video);
    }
  }

  onFileVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadVideo = input.files[0];

      // Cập nhật form với tên file (nếu cần)
      this.form.controls['videourl'].setValue(this.uploadVideo.name);

      // Hủy URL cũ nếu có để tránh memory leak
      if (this.preview_video) {
        URL.revokeObjectURL(this.preview_video);
      }

      // Tạo URL preview mượt hơn
      this.preview_video = URL.createObjectURL(this.uploadVideo);

      // Reset input để có thể chọn lại file trùng sau này
      input.value = '';
    }
  }





  //end video ---------

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
    // const item_type = this.type_item.find((i: any) => i.value === this.config.data.itemtype);
    // if (item_type) {
    // this.item.itemtype = itemtype.value.toString();
    Object.keys(values).forEach(key => {
      if (key !== 'image' && key !== 'pdfurl' && key != 'videourl') {
        this.item[key] = values[key];

        this.item[key] = key === 'postdate' ? this.formatPostDate(values[key]) : values[key];

      }

    });
    this._dataService.post(StringAPI.APIKehoachdantau, this.item)
      .subscribe(
        (res) => {
          this.ref.close(res || []);
        },
        (error) => {
        }
      );

    // }
  }
  formatPostDate(date: any): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      Object.keys(values).forEach(key => {
        if (key !== 'image' && key !== 'pdfurl' && key != 'videourl') {
          this.item[key] = values[key];
          this.item[key] = key === 'postdate' ? this.formatPostDate(values[key]) : values[key];

          if (key === "itemtype") {
            // console.log("itemtype", values[key])
            this.item[key] = values[key];
          }

        }
      }
      );
      this._dataService.put(StringAPI.APIKehoachdantau + "/" + this.EditData.id, this.item)
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
