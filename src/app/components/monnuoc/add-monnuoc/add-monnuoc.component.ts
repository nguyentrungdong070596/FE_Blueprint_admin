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
import { environment } from '../../../../environment/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    preview_upload: any;
    selectedPdfFile: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _dataService: DataService,
        private _uploadService: FileUploadService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
    ) { this.EditData = this.config.data }

    ngOnInit(): void {
        this.createForm();
        this.setValueFormEdit(this.EditData);
    }

    createForm() {
        this.form = this.fb.group({
            dataurl: [null, Validators.required],
            status: [true, Validators.required],
            postdate: [null, Validators.required],
        });
    }

    setValueFormEdit(data: any) {
        if (data) {
            this.form.patchValue({
                status: data?.status,
                postdate: data?.postdate
            });
            this.item.dataurl = this.EditData.dataurl;
            // Loại bỏ validators nếu là chế độ edit
            this.form.controls['dataurl'].clearValidators();
            this.form.controls['dataurl'].updateValueAndValidity();
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
                // Loại bỏ validator của trường dataurl nếu upload thành công
                this.form.controls['dataurl'].clearValidators();
                this.form.controls['dataurl'].updateValueAndValidity();
                this.item.dataurl = PdfData.file_save_url;
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
        this._dataService.post(StringAPI.APIManeuveringDraft, this.item)
            .subscribe(
                (res) => {
                    this.ref.close(res || []);
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
            this._dataService.put(StringAPI.APIManeuveringDraft + "/" + this.EditData.id, this.item)
                .subscribe(
                    (res) => {
                        this.ref.close(res || []);
                    },
                    (error) => {
                        console.error('Error update:', error);
                    }
                );

        }
    }
}
