import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-viewer.component.html',
})
export class FileViewerComponent implements OnChanges {
  @Input() fileUrl!: string;

  safeUrl: SafeResourceUrl | undefined;
  googleViewerUrl: SafeResourceUrl | undefined;
  fileType = '';
  textContent = '';

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnChanges(): void {
    if (!this.fileUrl) return;

    const ext = this.fileUrl.split('.').pop()?.toLowerCase();

    if (!ext) {
      this.fileType = 'unknown';
      return;
    }

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
    const isText = ['txt', 'csv', 'json'].includes(ext);
    const isGoogleDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);

    if (ext === 'pdf') {
      this.fileType = 'pdf';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    } else if (isImage) {
      this.fileType = 'image';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    } else if (isText) {
      this.fileType = 'text';
      this.http.get(this.fileUrl, { responseType: 'text' }).subscribe(data => {
        this.textContent = data;
      });
    } else if (isGoogleDoc) {
      this.fileType = 'docs';
      const url = `https://docs.google.com/gview?url=${this.fileUrl}&embedded=true`;
      this.googleViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.fileType = 'unsupported';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    }
  }
}
