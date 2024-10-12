import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private httpClient: HttpClient) { }

  createrheader() {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    };
  }

  postFile(fileToUpload: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient.post(environment.apiUrl + '/upload', formData).toPromise();
  }

}
