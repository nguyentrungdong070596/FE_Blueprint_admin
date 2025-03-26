import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Kiểm tra trạng thái đăng nhập (có thể sử dụng dịch vụ để kiểm tra)
    const isLoggedIn = !!localStorage.getItem('user'); // Ví dụ: kiểm tra nếu có user trong localStorage

    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      return false;
    }
  }
}
