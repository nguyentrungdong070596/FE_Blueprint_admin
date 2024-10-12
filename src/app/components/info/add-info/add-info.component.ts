import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { CalendarModule } from 'primeng/calendar';
import { DataService } from '../../../core/services/data.service';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-add-info',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ReactiveFormsModule, TreeSelectModule, CalendarModule],

  templateUrl: './add-info.component.html',
  styleUrls: ['./add-info.component.scss'],
  providers: [DatePipe]
})
export class AddInfoComponent implements OnInit {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  info: any = {};
  preview_upload: any;
  stringurl = environment.apiUrl;
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
      content: [null, Validators.required],
      status: [true, Validators.required],
    });
  }
  setValueFormEdit(data: any) {
    if (data) {
      this.form.patchValue({
        content: data?.content,
        status: data?.status,
      });
    }
    else {
      this.isEditMode = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/info']);
  }
  onSubmit(values: any) {
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
    this.info.status = true;
    this.info.content = values.content;
    this._dataService.post(StringAPI.APIIntroduction, this.info)
      .subscribe(
        (res) => {
          console.log('Info added successfully:', res);
        },
        (error) => {
          console.error('Error adding info:', error);
        }
      );

  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      this.info.status = values.status;
      this.info.content = values.content;

      this._dataService.put(StringAPI.APIIntroduction + "/" + this.EditData.id, this.info)
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
}

