import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  url = `${environment.apiUrl}/files`;
  constructor(private _http: HttpClient) {}

  upload(formData: FormData): Observable<HttpEvent<any>> {
    return this._http
      .post<any>(this.url, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total);
              return { status: 'progress', message: progress };
            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }

  getFiles(): Observable<any> {
    return this._http.get(`${this.upload}/files`);
  }
}
