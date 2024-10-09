import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CheckboxModule, PasswordModule, CommonModule, FormsModule, ButtonModule, ReactiveFormsModule, MessagesModule],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  password!: string;
  loginForm: FormGroup;
  messages: Message[] | undefined;
  loading: boolean = false;

  constructor(private _authService: AuthService, private _router: Router, private _fb: FormBuilder,private messageService: MessageService) {
    // if (this._authService.currentMemberValue) {
    //   this._router.navigate(['/dash']);
    // }
    this.loginForm = this._fb.group({
      // email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      lastName: [''],
      phone: [''],
      city: [''],
      address: ['']
    });
  }
  ngOnInit(): void {

  }
  async submitForm() {
    if (this.loginForm.invalid) {
      return;
    }
    try {
      console.log('this.login.value', this.loginForm.value)
      const res = await this._authService.register(this.loginForm.value).toPromise();
      if (res) {
        this.messageService.add({severity:'success', summary:'Tạo mới tài khoản thành công !'});
        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 3000);
      }
    } catch {
      this.messageService.add({severity:'error', summary:'Đăng ký tài khoản thất bại !'});
    }
    // this._authService.login(this.loginForm.value).subscribe((res) => {
    //   this._router.navigate(['/dash']);
    // });
  }
  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
  
}
