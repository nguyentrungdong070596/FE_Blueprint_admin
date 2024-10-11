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
@Component({
    selector: 'app-add-monnuoc',
    standalone: true,
    imports: [PdfViewerModule, CommonModule, ReactiveFormsModule, ButtonModule],
    templateUrl: './add-monnuoc.component.html',
    styleUrls: ['./add-monnuoc.component.scss']
})
export class AddMonnuocComponent implements OnInit {
    form!: FormGroup;
    isEditMode = true;
    EditData: any;
    item: any = {};
    selectedPdfFile: any;
    preview_upload: any;
    stringurl: any;
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
            dataurl: [null, Validators.required],
            status: [null, Validators.required],
            postdate: [null, Validators.required],
        });
    }

    setValueFormEdit(data: any) {
        if (data) {
            this.form.patchValue({
                status: data?.status,
                dataurl: data?.dataurl,
                postdate: data?.postdate

                // call view image in here
            });
        }
        else {
            this.isEditMode = false;
        }
    }
    handleFileInput(values: any) {
        const processSave = () => {
            if (this.isEditMode) {
                this.onEdit(values);
            } else {
                this.onInsert(values);
            }
            this.goBack();
        };

        if (this.selectedPdfFile) {
            this._uploadService.postFile(this.selectedPdfFile).subscribe((data: any) => {
                this.item.Dataurl = data.file_save_url;
                processSave();
            });
        }
        else {
            this.item.pdfdata = this.EditData?.pdfdata;
        }
        processSave();
    }

    goBack(): void {
        this.router.navigate(['/monnuoc']);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Kiểm tra xem người dùng có chọn tệp hay không
        if (input.files && input.files.length > 0) {
            this.selectedPdfFile = input.files[0];  // Lấy tệp PDF đầu tiên từ danh sách tệp
        }
    }

    onSubmit(values: any) {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
        }
        this.handleFileInput(values)
    }

    onInsert(values: any) {
        this.item.status = true;
        this.item.PostDate = values.postdate;
        this._dataService.post(StringAPI.APIManeuveringDraft, this.item)
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
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
        }
        if (this.EditData && this.EditData.id && values) {
            this.item.status = values.status;
            this.item.PostDate = values.postdate;

            this._dataService.put(StringAPI.APIManeuveringDraft + "/" + this.EditData.id, this.item)
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
