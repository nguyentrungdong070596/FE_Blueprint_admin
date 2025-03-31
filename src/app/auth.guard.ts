import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) { }
  canActivate(
    route?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentMember = this._authService.currentMemberValue;
    if (currentMember && currentMember.token) {
      if (this._authService.isAuthenticated(currentMember.token)) {
        return true;
      }
      //Your session has expired
      this._router.navigate(['/login']);
      return false;
    }

    // // not logged in so redirect to login page with the return url
    this._router.navigate(['/login']);
    return false;
  }
}
