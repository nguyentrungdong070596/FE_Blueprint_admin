import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form!: FormGroup;
  loading: boolean = false;
  messages: Message[] | undefined;
  constructor(private fb: FormBuilder,
    private _authService: AuthService,

    private _router: Router,
    private messageService: MessageService
  ) {
    validators: this.passwordsMatchValidator
  }

  ngOnInit(): void {
    this.createForm(); // Gọi hàm tạo form trong ngOnInit
  }
  onSubmit() {

  }
  createForm() {
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required]),
      phone: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: ['', Validators.required, Validators.minLength(8)]

    });
  }
  passwordsMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  register(value: any) {
    // If the form is invalid, mark all controls as touched
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng kiểm tra lại tính hợp lệ các trường'
      });
      return;
    }

    // Check for mismatched passwords
    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu và xác nhận mật khẩu không khớp'
      });
      return;
    }




    // Remove the confirmPassword field from the value object before submission
    const { confirmPassword, ...submitValue } = value;
    submitValue.phone = submitValue.phone.toString()
    this.loading = true;
    submitValue.role = "user"; // Thêm trường role vào submitValue

    this._authService.register(submitValue).subscribe(
      (res: any) => {
        // this._router.navigateByUrl('/dash');
        if (res.code === 400) {
          const detailMessage = res.message.Tag
            ? `Thông tin ${res.message.Tag} đã tồn tại`
            : `Thông tin ${res.message} đã tồn tại`;
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: detailMessage
          });
          this.loading = false;
        }
        else if (res.code == 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: "Tạo thành công tài khoản !"
          });
          this.loading = false;
          this._router.navigateByUrl('/logon');

        }

      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: "Thông tin đăng nhập và mật khẩu không chính xác"
        });
        this.loading = false;
      }
    );
  }

}

