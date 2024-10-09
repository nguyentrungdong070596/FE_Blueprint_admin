import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
@Component({
    selector: 'app-add-monnuoc',
    standalone: true,
    imports: [PdfViewerModule, CommonModule,ReactiveFormsModule],
    templateUrl: './add-monnuoc.component.html',
    styleUrls: ['./add-monnuoc.component.scss']
})
export class AddMonnuocComponent implements OnInit {
    monnuocForm!: FormGroup;
    selectedFile: File | null = null;
    pdfSrc: SafeUrl | null = null;  // Biến để giữ URL an toàn cho PDF

    constructor(
        private router: Router, 
        private formBuilder: FormBuilder, 
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        // Khởi tạo FormGroup với FormBuilder
        this.monnuocForm = this.formBuilder.group({
            date: ['', Validators.required],
            file: [null, Validators.required]
            // Thêm bất kỳ trường nào khác nếu cần
        });
    }
    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.selectedFile = file;
            // Tạo URL an toàn cho PDF
            const objectUrl = URL.createObjectURL(file);
            console.log("PDF URL:", objectUrl);  // Kiểm tra URL trong console
            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);  // Lưu URL an toàn để hiển thị trong iframe
        } else {
            alert('Vui lòng chọn tệp PDF hợp lệ.');
        }
    }

    onSubmit() {
        if (this.selectedFile && this.monnuocForm.valid) {
            const formattedDate = this.formatDate(this.monnuocForm.value.date);
            
            // Logic để lưu thông tin
            console.log('Lưu thông tin:', {
                date: formattedDate,
                file: this.selectedFile,
            });
            // Thực hiện lưu file PDF và thông tin vào cơ sở dữ liệu tại đây
        } else {
            alert('Vui lòng tải lên tệp PDF và kiểm tra thông tin.');
        }
    }

    formatDate(date: string): string {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }

    goBack() {
        this.router.navigate(['/monnuoc']);
    }
}
