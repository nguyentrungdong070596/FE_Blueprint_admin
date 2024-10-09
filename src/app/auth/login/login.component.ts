import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup; // FormGroup để quản lý form
  showPassword: boolean = false;
  passwordStrengthMessage: string = '';
  passwordStrengthClass: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Sử dụng FormBuilder để tạo form với các validator
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], // Trường username bắt buộc
      password: ['', [Validators.required, Validators.minLength(8)]], // Trường password bắt buộc và phải có ít nhất 8 ký tự
      remember: [false] // Trường remember là checkbox
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  checkPasswordStrength() {
    const password = this.loginForm.get('password')?.value || '';
    const strength = this.calculatePasswordStrength(password);

    if (strength === 'weak') {
      this.passwordStrengthMessage = 'Mật khẩu yếu';
      this.passwordStrengthClass = 'weak';
    } else if (strength === 'medium') {
      this.passwordStrengthMessage = 'Mật khẩu trung bình';
      this.passwordStrengthClass = 'medium';
    } else if (strength === 'strong') {
      this.passwordStrengthMessage = 'Mật khẩu mạnh';
      this.passwordStrengthClass = 'strong';
    } else {
      this.passwordStrengthMessage = '';
      this.passwordStrengthClass = '';
    }
  }

  // Hàm kiểm tra độ mạnh của mật khẩu
  calculatePasswordStrength(password: string): string {
    let strength = 0;
    if (password.length >= 8) strength++; // Kiểm tra độ dài
    if (/[A-Z]/.test(password)) strength++; // Kiểm tra ký tự viết hoa
    if (/[0-9]/.test(password)) strength++; // Kiểm tra số
    if (/[\W]/.test(password)) strength++; // Kiểm tra ký tự đặc biệt

    if (strength < 2) {
      return 'weak';
    } else if (strength === 2 || strength === 3) {
      return 'medium';
    } else {
      return 'strong';
    }
  }

  // Hàm xử lý khi submit form
  onSubmit() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Giả lập logic kiểm tra đăng nhập
    if (username === 'admin' && password === 'Admin@123') {
      localStorage.setItem('user', JSON.stringify({ username }));
      this.router.navigate(['/dashboard']); // Chuyển hướng đến trang dashboard
    } else {
      alert('Thông tin đăng nhập không chính xác!');
    }
  }
}
