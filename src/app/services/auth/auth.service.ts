import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { JWTProfile } from "../../models/jwt-profile.model";
import { environment } from "../../../../environments/environment";
import { MemberLogin, UserRegister } from "../../models/member.model";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { DecodeToken } from "../../models/decode-token.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrl;
  private memberSubject: BehaviorSubject<JWTProfile | any> =
    new BehaviorSubject<JWTProfile>({});
  public member: Observable<JWTProfile> | undefined;
  constructor(private _http: HttpClient, private _router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('NINO-MOTOR') || '';
      if (data) {
        this.memberSubject = new BehaviorSubject<JWTProfile>(JSON.parse(data));
      }
      this.member = this.memberSubject.asObservable();
    }
  }

  public get currentMemberValue(): JWTProfile {
    return this.memberSubject.value;
  }

  /**
   * login
   *
   * @param member
   * @returns
   */
  login(memberLogin: MemberLogin): Observable<{ token: string }> {
    return this._http
      .post<{ token: string }>(this.url + '/signin', memberLogin)
      .pipe(
        map((res: any) => {
          // login successful if there's a jwt token in the response
          if (res.data && res.data.token && this.isAuthenticated(res.data.token)) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            let decoded: JWTProfile = jwtDecode(res.data.token);
            decoded.token = res.data.token;
            localStorage.setItem('NINO-MOTOR', JSON.stringify(decoded));
            // localStorage.setItem('NINO-MOTOR', res.data.token);
            this.memberSubject.next(res.data);
          }
          return res.data;
        })
      );
  }

  register(userRegister: UserRegister): Observable<{ token: string }> {
    return this._http
      .post<{ token: string }>(this.url + '/signup', userRegister)
      .pipe(
        map((res) => {
          // // login successful if there's a jwt token in the response
          // if (res && res.token && this.isAuthenticated(res.token)) {
          //   // store user details and jwt token in local storage to keep user logged in between page refreshes
          //   let decoded: JWTProfile = jwtDecode(res.token);
          //   decoded.token = res.token;
          //   localStorage.setItem('NINO-MOTOR', JSON.stringify(decoded));
          //   this.memberSubject.next(res);
          // }
          return res;
        })
      );
  }

  /**
   * Check expired
   * @returns boolen
   */
  isAuthenticated(token: string): boolean {
    if (!token) {
      return false;
    }
    const decoded: JWTProfile = jwtDecode(token);

    if (!decoded) {
      return false;
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return false;
    }
    return true;
  }

  getParseTokenUser(): DecodeToken {
    var const_data: any = {};
    // var decoded: any = (this.memberSubject.value);
    var decoded: any = localStorage.getItem('NINO-MOTOR');
    if (decoded) {
      let decodedToken = JSON.parse(decoded);
      const_data.exp = (decodedToken.exp.toString());
      const_data.role = atob(decodedToken.role.toString());
      const_data.username = atob(decodedToken.username.toString());
      const_data.id = atob(decodedToken.id.toString());
    }
    return const_data;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('NINO-MOTOR');
    this.memberSubject.next({});
    this._router.navigate(['/login']);
  }
}
