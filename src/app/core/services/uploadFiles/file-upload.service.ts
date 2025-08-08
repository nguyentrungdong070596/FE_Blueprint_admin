import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 5MB in bytes
  private readonly MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 5MB in bytes

  constructor(private httpClient: HttpClient) { }

  createrheader() {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    };
  }

  async postFile(fileToUpload: File): Promise<any> {
    // Kiểm tra kích thước file trước khi upload
    if (fileToUpload.size > this.MAX_FILE_SIZE) {
      throw new Error('Kích thước file vượt quá giới hạn 5MB.');
    }

    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);

    try {
      return await this.httpClient.post(`${environment.apiUrl}/upload`, formData).toPromise();
    } catch (error: any) {
      let errorMessage = 'Lỗi không xác định!';
      if (error instanceof HttpErrorResponse) {
        // Lỗi từ server
        errorMessage = `Mã lỗi: ${error.status}\nThông điệp: ${error.message}`;
      } else {
        // Lỗi từ client hoặc mạng
        errorMessage = `Lỗi: ${error.message}`;
      }
      throw new Error(errorMessage);
    }
  }


  async postFileVideo(fileToUpload: File): Promise<any> {
    // Kiểm tra kích thước file trước khi upload
    if (fileToUpload.size > this.MAX_VIDEO_SIZE) {
      // Trả về lỗi chứ không throw
      return { error: true, message: 'Kích thước file vượt quá giới hạn 500MB.' };
    }

    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);

    try {
      return await this.httpClient.post(`${environment.apiUrl}/upload-video`, formData).toPromise();
      // return { error: false, data: response };
    } catch (error: any) {
      let errorMessage = 'Lỗi không xác định!';
      if (error instanceof HttpErrorResponse) {
        errorMessage = `Mã lỗi: ${error.status}\nThông điệp: ${error.message}`;
      } else {
        errorMessage = `Lỗi: ${error.message}`;
      }
      return { error: true, message: errorMessage };
    }
  }

}
