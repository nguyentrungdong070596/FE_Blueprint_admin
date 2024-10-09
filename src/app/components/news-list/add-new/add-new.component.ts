import { Router } from '@angular/router';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { CalendarModule } from 'primeng/calendar';
import { DataService } from '../../../core/services/data.service';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';
import { StringAPI } from '../../../shared/stringAPI/string_api';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, ReactiveFormsModule, TreeSelectModule, CalendarModule],

  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
  providers: [DatePipe]
})
export class AddNewComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  news: any = {};
  uploadImage: any;
  preview_upload: any;
  stringurl: any;
  fileToUpload: File | null = null;
 selectedFile: File | null = null;
@Output() newsAdded = new EventEmitter<any>();
  // dateValue: Date | undefined;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService
  ) {    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; 
      const newsToEdit = navigation.extras.state['newsToEdit']; 
      if (newsToEdit) {
        this.setFormValues(newsToEdit);
      }
    } else {
      console.error('No file selected');
    }
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      title: this.fb.control(null, [Validators.required]),
      image: this.fb.control(null),
      content: this.fb.control(null),
      status: this.fb.control(null),
      postdate: this.fb.control(null),
    });
  }
  // setValueFormEdit(data: any) {
  //   var status = this.trangThai.find((x: any) => x.code == data?.status);
  //   this.form.controls['code'].setValue(data?.code);
  //   this.form.controls['name'].setValue(data?.name);
  //   this.form.controls['status'].setValue(status);
  // }

  handleFileInput(values: any) {
    // Check if a file has been selected
    if (this.uploadImage && this.uploadImage.length > 0) {
      this.fileToUpload = this.uploadImage[0]; // Access the file directly via index
      if (this.fileToUpload) {
        this._uploadService.postFile(this.fileToUpload).subscribe(
          (data: any) => {
            this.news.image = data.file_save_url;
            this.onInsert(values);
            this.back();
          },
          (error: any) => {
            console.error('Error uploading file:', error);
          }
        );

  back(): void {
    this.router.navigate(['/news']);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.handleFileInput(values)
    this.newsAdded.emit(this.form.value); // Gửi dữ liệu tin tức
    this.resetForm();
  }
        setFormValues(data: any) {
    this.form.patchValue({
      title: data.name,
      content: data.detail,
      image: data.image,
      status: data.status,
      date: data.date
    });
  }
        resetForm() {
    this.form.reset({
      title: '',
      content: '',
      image: '',
      status: 'Hiển thị',
      date: ''
    });
    this.selectedFile = null;

  onInsert(values: any) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    else {
      this.news.title = values.title;
      this.news.status = true;
      this.news.content = values.content;
      this.news.postdate = values.postdate;

      this._dataService.post(StringAPI.APINews, this.news)
        .subscribe(
          (res) => {
            console.log('News added successfully:', res);
          },
          (error) => {
            console.error('Error adding news:', error);
          }
        );
    }
  }
  // onEdit(values: any, id: any) {
  //   this.loading = true;
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     this.loading = false;
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Thông báo',
  //       detail: 'Vui lòng nhập đầy đủ thông tin !!',
  //     });
  //     return;
  //   }
  //   this.news.name = values.name;
  //   this.news.code = values.code;
  //   this.news.status = values.status.code || false;
  //   this._dataService
  //     .put(`${StringAPI.APIChucVu}/${id}`, this.news)
  //     .subscribe(
  //       (res: any) => {

  //         if (res.success) {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Thêm mới',
  //             detail: 'Thêm mới thành công',
  //           });
  //           this.ref.close(res || []);
  //         } else {
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Lỗi',
  //             detail: res.msg,
  //           });
  //         }
  //         this.loading = false;
  //       },
  //       (error) => {
  //         this.loading = false;
  //       }
  //     );
  // }
}
