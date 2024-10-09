import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth/auth.service';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CheckboxModule, PasswordModule, CommonModule, FormsModule, ButtonModule, ReactiveFormsModule, ToastModule, MessagesModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  email!: string;
  password!: string;
  loginForm: FormGroup;
  messages: Message[] | undefined;
  loading: boolean = false;
  constructor(private _authService: AuthService, private _router: Router, private _fb: FormBuilder, private messageService: MessageService) {
    if (this._authService.currentMemberValue) {
      this._router.navigate(['/dash']);
    }
    this.loginForm = this._fb.group({
      // email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {

  }
  submitForm() {
    // this._router.navigate(['/dash']);
    // if (this.loginForm.invalid) {
    //   this.messageService.add({severity:'error', summary:'Mật khẩu không đúng yêu cầu !'})
    // }
    // // try {
    // //   const res = await this._authService.login(this.loginForm.value).toPromise();
    // //   if (res) {
    // //     this.messageService.add({severity:'success', summary:'Đăng nhập thành công !'});
    // //     setTimeout(() => {
    // //       this._router.navigate(['/dash']);
    // //     }, 3000);
    // //   }
    // //   this.messageService.add({severity:'error', summary:'Tài khoản hoặc mặt khẩu không chính xác'});
    // // } catch {
    // //   this.messageService.add({severity:'error', summary:'Tài khoản hoặc mặt khẩu không chính xác'});
    // // }
    this.loading = true;
    this._authService.login(this.loginForm.value).subscribe((res) => {
      // this._router.navigate(['/dash']);
      this._router.navigateByUrl('/dash');
      this.loading = false;
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: "Thông tin đăng nhập và mật khẩu không chính xác" });
      this.loading = false;
    });
  }
}
