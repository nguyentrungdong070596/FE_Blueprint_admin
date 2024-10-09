import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  passwordStrengthMessage: string = '';
  passwordStrengthClass: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // Sử dụng FormBuilder để tạo form với các validator
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required], // Trường username bắt buộc
      password: ['', [Validators.required, Validators.minLength(8)]], // Trường password bắt buộc và phải có ít nhất 8 ký tự
      confirmPassword: ['', Validators.required], // Trường xác nhận mật khẩu
      remember: [false] // Trường remember là checkbox
    }, { validators: this.passwordMatchValidator }); // Sử dụng validator để kiểm tra mật khẩu và xác nhận mật khẩu
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField: any = document.getElementById('password');
    const confirmPasswordField: any = document.getElementById('confirmPassword');
    passwordField.type = this.showPassword ? 'text' : 'password';
    confirmPasswordField.type = this.showPassword ? 'text' : 'password';
  }

  checkPasswordStrength() {
    const password = this.registerForm.get('password')?.value || '';
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

  // Hàm kiểm tra sự khớp giữa mật khẩu và xác nhận mật khẩu
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  // Hàm xử lý khi submit form
  onSubmit() {
    if (this.registerForm.valid) {
      const username = this.registerForm.get('username')?.value;
      const password = this.registerForm.get('password')?.value;
      // Thực hiện logic đăng ký ở đây, như gửi yêu cầu tới API
      console.log('Đăng ký thành công:', { username, password });
      // Chuyển hướng hoặc làm gì đó sau khi đăng ký thành công
    }
  }
}
