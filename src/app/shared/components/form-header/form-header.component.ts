import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environment/environment';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StringAPI } from '../../stringAPI/string_api';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.EditData = this.config.data.itemData;
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
  }

  showField(fieldName: string): boolean {
    return this.config.data.fields.some((field: { name: string }) => field.name === fieldName);
  }

  createForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.config.data.fields.forEach((field: any) => {
      if (field.required) {
        formGroupConfig[field.name] = [null, Validators.required];
      } else {
        formGroupConfig[field.name] = [null];
      }
    });
    this.form = this.fb.group(formGroupConfig);
  }

  setValueFormEdit(data: any) {
    if (data && data.id) {
      const formData: any = {};
      this.config.data.fields.forEach((field: any) => {
        formData[field.name] = data[field.name];
      });
      this.form.patchValue(formData);
    } else {
      this.isEditMode = false;
    }
  }

  async onSubmit(values: any) {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
    if (this.isEditMode) {
      this.onEdit(values);
    } else {
      this.onInsert(values);
    }
  }

  onInsert(values: any) {
    Object.keys(values).forEach(key => {
      this.item[key] = values[key];
    });
    this._dataService.post(StringAPI.APIHeader, this.item)
      .subscribe(
        (res) => {
          this.ref.close(res || []);
        },
        (error) => {
          console.error('Insert error:', error);
        }
      );
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      Object.keys(values).forEach(key => {
        this.item[key] = values[key];
      });
      this._dataService.put(StringAPI.APIHeader + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.ref.close(res || []);
          },
          (error) => {
            console.error('Update error:', error);
          }
        );
    }
  }
}