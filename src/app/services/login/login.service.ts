import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://api.freeapi.app/api/v1/users/login';

  constructor(private http: HttpClient) { }
  private tokenKey = "token";
  onLogin(username: string, password: string): Observable<any> {
    const loginData = { password, username };
    return this.http.post<any>(this.apiUrl, loginData).pipe(map((response) => {
      if (response.success != false) {
        localStorage.setItem(this.tokenKey, response.data.accessToken);
      }
    }));
  }

  getId() {
    return this.http.get('https://api.freeapi.app/api/v1/users/current-user');
  }
  isLoggedIn = (): boolean => {
    const token = this.getToken
    if (!token) return false;

    return !this.isTokenExpired
  }
  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    return isTokenExpired
  }


  private getToken = (): string | null => localStorage.getItem(this.tokenKey) || '';

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    const userDetail = {
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    }

    return userDetail
  }
}
