import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logon',
  standalone: true,
  imports: [
    RouterOutlet, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './logon.component.html',
  styleUrl: './logon.component.scss'
})
export class LogonComponent {

  form!: FormGroup;
  loading: boolean = false;
  // loginForm: FormGroup; // FormGroup để quản lý form
  showPassword: boolean = false;
  passwordStrengthMessage: string = '';
  passwordStrengthClass: string = '';
  messages: Message[] | undefined;
  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private router: ActivatedRoute,
    private router1: Router,
    private _router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.createForm(); // Gọi hàm tạo form trong ngOnInit
  }
  onSubmit() {

  }
  createForm() {
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  login(value: any) {
    this.loading = true;
    this._authService.login(value).subscribe((res: any) => {

      this._router.navigateByUrl('/home');
      this.loading = false;
      // Điều hướng sang trang Home và truyền query param "welcome"
      this._router.navigate(['/home'], { queryParams: { welcome: 'true' } });
    }, (error) => {

      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Thông tin đăng nhập và mật khẩu không chính xác" });
      this.loading = false;
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  checkPasswordStrength() {
    const password = this.form.get('password')?.value || '';
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
}

