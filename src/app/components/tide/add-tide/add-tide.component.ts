import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { DataService } from '../../../core/services/data.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
  selector: 'app-add-tide',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './add-tide.component.html',
  styleUrls: ['./add-tide.component.scss'],
  providers: [DatePipe]
})
export class AddTideComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl: any;
  selectedPdfFile: any;

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
      pdfuri: [null, Validators.required],
      postdate: [null, Validators.required],
      status: [true, Validators.required],
    });
  }

  setValueFormEdit(data: any) {
    if (data) {
      this.form.patchValue({
        status: data?.status,
        postdate: data?.postdate
      });
      this.item.pdfuri = this.EditData.pdfuri;
      this.form.controls['pdfuri'].clearValidators();
      this.form.controls['pdfuri'].updateValueAndValidity();
    }
    else {
      this.isEditMode = false;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
    }
  }

  async handleFileInput() {
    if (this.selectedPdfFile) {
      const PdfData = await this._uploadService.postFile(this.selectedPdfFile);
      if (PdfData.file_save_url) {
        // Loại bỏ validator của trường image nếu upload thành công
        this.form.controls['pdfuri'].clearValidators();
        this.form.controls['pdfuri'].updateValueAndValidity();
        this.item.pdfuri = PdfData.file_save_url;
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
    this.item.postdate = values.postdate;
    this._dataService.post(StringAPI.APITide, this.item)
      .subscribe(
        (res) => {
          this.router.navigate(['/tide']).then(() => {
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
      this.item.postdate = values.postdate;
      this._dataService.put(StringAPI.APITide + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.router.navigate(['/tide']).then(() => {
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
