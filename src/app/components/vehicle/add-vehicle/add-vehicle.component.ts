import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'; 
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  providers: [DatePipe]
})
export class AddVehicleComponent implements OnInit {
  @Output() vehicleAdded = new EventEmitter<any>();
  
  vehicleForm!: FormGroup; // Tạo FormGroup cho phương tiện
  isEditMode = false; // Kiểm tra chế độ chỉnh sửa
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Kiểm tra nếu có dữ liệu truyền vào từ router
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.isEditMode = navigation.extras.state['isEditMode'] || false; 
      const vehicleToEdit = navigation.extras.state['vehicleToEdit']; 
      if (vehicleToEdit) {
        this.setFormValues(vehicleToEdit);
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.vehicleForm = this.fb.group({
      type: ['', Validators.required],
      image: [''], // Chỉ dùng để lưu tên tệp
      name: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  setFormValues(data: any) {
    this.vehicleForm.patchValue({
      type: data.type,
      image: data.image,
      name: data.name,
      code: data.code,
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.vehicleForm.patchValue({ image: file.name });
    }
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.vehicleAdded.emit(this.vehicleForm.value); // Gửi dữ liệu phương tiện
    this.resetForm();
  }

  resetForm() {
    this.vehicleForm.reset();
    this.selectedFile = null;
  }

  goBack() {
    this.router.navigate(['/vehicle']);
  }
}
