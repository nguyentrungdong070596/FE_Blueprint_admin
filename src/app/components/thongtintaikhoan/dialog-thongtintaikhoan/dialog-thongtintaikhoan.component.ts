import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

import { ImageModule } from 'primeng/image';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { StringAPI } from '../../../shared/stringAPI/string_api';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { FileUploadService } from '../../../core/services/uploadFiles/file-upload.service';

@Component({
  selector: 'app-dialog-thongtintaikhoan',
  standalone: true,

  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,

    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    DropdownModule,
    CalendarModule,
    ImageModule,
    AutoCompleteModule,
  ],
  providers: [MessageService],

  templateUrl: `./dialog-thongtintaikhoan.component.html`,
  styleUrl: './dialog-thongtintaikhoan.component.scss',
})
export class DialogThongTinTaiKhoanComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public _authService: AuthService,
  ) {
    // ✅ Now, initialize forms inside the constructor
    this.form = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      city: [null, Validators.required],
      address: [null, Validators.required],
      role: [null, Validators.required],
      status: [null, Validators.required],
    });

    this.formCredential = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  loading: boolean = false;
  form: FormGroup
  formCredential: FormGroup
  const_data: any = {};
  data_user: any;
  const_data_credential: any = {};
  emailData = {
    to: '',
    subject: '',
    body: '',
  };
  trangThai: any = [
    { code: true, name: 'Hoạt động' },
    { code: false, name: 'Không hoạt động' },
  ];
  Role: any = [
    { code: 'admin', name: 'Quản trị' },
    { code: 'user', name: 'Nhân viên' },
  ];


  async ngOnInit(): Promise<void> {

    this.createForm();
    this.createFormCredential();
  }

  close() {
    this.ref.close();
  }
  nhanvienid: any;
  nhanvienidstr: any;


  createFormCredential() {
    this.formCredential = this.fb.group(
      {
        password: ['', Validators.required],
        username: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    if (this.config.data.Id) {
      this.setValueFormCredentialEdit(this.config.data);
    }
  }
  createForm() {
    this.form = this.fb.group({
      firstName: this.fb.control(null, [Validators.required]),
      lastName: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required]),
      phone: this.fb.control(null, [Validators.required]),
      city: this.fb.control(null, [Validators.required]),
      manhanvien: this.fb.control(null, [Validators.required]),
      address: this.fb.control(null, [Validators.required]),
      role: this.fb.control(null, [Validators.required]),
      status: this.fb.control(null, [Validators.required]),
    });
    if (this.config.data.Id) {
      this.setValueFormEdit(this.config.data);
    }
  }
  setValueFormCredentialEdit(data: any) {
    this.formCredential.controls['username'].setValue(data?.username);
  }
  setValueFormEdit(data: any) {
    this.data_user = data;
    var status = this.trangThai.find((x: any) => x.code == data?.status);
    var role = this.Role.find((x: any) => x.code == data?.role);

    this.form.controls['firstName'].setValue(data?.firstName);
    this.form.controls['lastName'].setValue(data?.lastName);
    this.form.controls['email'].setValue(data?.email);
    this.form.controls['phone'].setValue(data?.phone);
    this.form.controls['city'].setValue(data?.city);

    this.form.controls['address'].setValue(data?.address);
    this.form.controls['role'].setValue(role);
    this.form.controls['status'].setValue(status);
  }
  onSubmitCredential(values: any) {
    if (this.formCredential.valid) {
      var data = this.config.data;
      if (data?.Id) {
        this.onEditCredential(values, data?.Id);
      } else if (!data?.Id) {
        this.onInsert(values);
      }
    }
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(values: any) {
    var data = this.config.data;
    if (data?.Id) {
      this.onEdit(values, data?.Id);
    } else if (!data?.Id) {
      this.onInsert(values);
    }
  }

  onInsert(values: any) {
    this.loading = true;
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.loading = false;
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Thông báo',
    //     detail: 'Vui lòng nhập đầy đủ thông tin !!',
    //   });
    //   return;
    // }


    this.const_data.firstName = values.firstName;
    this.const_data.lastName = values.lastName;
    this.const_data.phone = values.phone;
    this.const_data.email = values.email;
    this.const_data.city = values.city;
    this.const_data.address = values.address;
    this.const_data.nhanvienid = this.nhanvienid ?? this.config.data.nhanvienid;
    this.const_data.nhanvienidstr =
      this.nhanvienidstr ?? this.config.data.nhanvienidstr;



    this.const_data.role = values.role?.code ?? true;
    this.const_data.status = values.status?.code ?? true;
    this._dataService.post(`${StringAPI.ApiUser}`, this.const_data).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.messageService.add({
          severity: 'success',
          summary: 'Thêm mới',
          detail: 'Thêm mới thành công',
        });

        this.ref.close(res || []);
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  onEditCredential(values: any, id: any) {
    this.loading = true;
    // if (this.formCredential.invalid) {
    //   this.formCredential.markAllAsTouched();
    //   this.loading = false;
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Thông báo',
    //     detail: 'Vui lòng nhập đầy đủ thông tin !!',
    //   });
    //   return;
    // }

    this.const_data_credential.username = values.username;
    this.const_data_credential.password = values.password;

    this._dataService
      .putUser(`${StringAPI.ApiUser}/pass`, id, this.const_data_credential)
      .subscribe(
        (res: any) => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật',
            detail: 'Cập nhật mật khẩu thành công',
          });
        }

      );
  }

  async uploadFile(file: File): Promise<string> {
    try {
      let uploadResponse: any
      if (file) {
        uploadResponse = await this._uploadService.postFile(file);

      }

      if (uploadResponse && !uploadResponse.error) {
        return uploadResponse?.file_save_url; // Đây là tên file hoặc URL nếu cần
      } else {
        throw new Error(uploadResponse.msg || 'Upload file thất bại.');
      }
    } catch (error) {
      throw error; // Đưa lỗi lên phía trên để xử lý
    }
  }
  async onEdit(values: any, id: any) {
    this.loading = true;
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.loading = false;
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Thông báo',
    //     detail: 'Vui lòng nhập đầy đủ thông tin !!',
    //   });
    //   return;
    // }
    let imgUrl: string | undefined;

    if (this.selectedFile) {
      imgUrl = await this.uploadFile(this.selectedFile);
    }

    this.const_data.firstName = values.firstName;
    this.const_data.lastName = values.lastName;
    this.const_data.phone = values.phone;
    this.const_data.email = values.email;
    this.const_data.city = values.city;
    this.const_data.nhanvienid = this.nhanvienid ?? this.config.data.nhanvienid;
    this.const_data.nhanvienidstr =
      this.nhanvienidstr ?? this.config.data.nhanvienidstr;
    this.const_data.address = values.address;
    this.const_data.role = values.role?.code;
    this.const_data.image = imgUrl ?? this.config.data.image;
    this.const_data.status = values.status?.code ?? false;
    this._dataService.putUser(`${StringAPI.ApiUser}`, id, this.const_data).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật',
          detail: 'Cập nhật thông tin tài khoản thành công',
        });
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  createAccount(
    username: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    nhanvienid: number,
    nhanvienidStr: string,
    image: string,
    city: string,
    address: string
  ) {
    const accountData = {
      username: username,
      email: email,
      phone: phone,
      image: image,
      city: city,
      address: address,
      firstName: firstName,
      lastName: lastName,
      nhanvienid: nhanvienid,
      nhanvienidStr: nhanvienidStr,
      status: true,
      role: 'user',
      password: 'Admin@123', // Bạn có thể tạo mật khẩu ngẫu nhiên tại đây
    };

    this._authService.register(accountData).subscribe(
      (res: any) => {
        if (res.code === 400) {
          const detailMessage = res.message.Tag
            ? `Thông tin ${res.message.Tag} đã tồn tại`
            : `Thông tin ${res.message} đã tồn tại`;
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: detailMessage,
          });
          this.loading = false;
        } else if (res.code == 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Tạo thành công tài khoản !',
          });


          this.loading = false;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: 'Thông tin đăng nhập và mật khẩu không chính xác',
        });
        this.loading = false;
      }
    );
  }
  closeDialog(data?: any) {
    this.ref.close(data);
  }

  ShowFieldMatKhau() {
    this.showPasswordFields = !this.showPasswordFields;
  }
  showPasswordFields: boolean = false; // Điều chỉnh giá trị này dựa trên yêu cầu của bạn

  selectedFile: File | null = null; // file này để gửi vào api/upload xong server trả về url lưu vào img của formgroup
  previewUrl: string | ArrayBuffer | null = null; // Đường dẫn hoặc base64 của ảnh
  APIs: string = environment.apiUrl + '/';

  onFileSelected_ByBase64String(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result; // Lưu đường dẫn hoặc base64 vào previewUrl
      };

      reader.readAsDataURL(this.selectedFile); // Chuyển file sang chuỗi base64
    }
  }
}
