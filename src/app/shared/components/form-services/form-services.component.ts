import { Component } from "@angular/core";
import { StringAPI } from "../../stringAPI/string_api";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { environment } from "../../../../environment/environment";
import { Router } from "@angular/router";
import { DataService } from "../../../core/services/data.service";
import { FileUploadService } from "../../../core/services/uploadFiles/file-upload.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CommonModule } from "@angular/common";
import { QuillModule } from "ngx-quill";
import { ButtonModule } from "primeng/button";
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
  NgxEditorService,
} from "ngx-editor";
@Component({
  selector: "app-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    ButtonModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
  ],
  templateUrl: "./form-services.component.html",
  styleUrl: "./form-services.component.scss",
})
export class FormServicesComponent {
  form!: FormGroup;
  isEditMode = true;
  EditData: any;
  item: any = {};
  stringurl = environment.apiUrl;
  preview_upload: any;
  uploadImage: any;
  selectedPdfFile: any;
  imageAlign: "right" | "left" | "center" = "right"; // ✅ mặc định chèn bên phải

  html = "";
  html_en = "";
  editor!: Editor;
  editor_en!: Editor;
  customToolbar: Toolbar;
  customToolbar_en: Toolbar;
  type_item: any = [
    {
      id: 0,
      name: "banner",
    },
    {
      id: 1,
      name: "news",
    },
    {
      id: 2,
      name: "dichvu",
    },
    {
      id: 3,
      name: "thungo",
    },
    {
      id: 4,
      name: "nhiemvu",
    },
    {
      id: 5,
      name: "lanhdao",
    },
    {
      id: 6,
      name: "tochuc",
    },
    {
      id: 7,
      name: "luocsu",
    },
    {
      id: 8,
      name: "tintuc",
    },
    {
      id: 9,
      name: "thongbao",
    },
    {
      id: 10,
      name: "vanban",
    },
    {
      id: 11,
      name: "thamkhao",
    },
    {
      id: 12,
      name: "monnuoc",
    },
    {
      id: 13,
      name: "giadichvu",
    },
    {
      id: 14,
      name: "hoatieu",
    },
    {
      id: 15,
      name: "vungnuoc",
    },
    {
      id: 16,
      name: "thuytrieu",
    },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _dataService: DataService,
    private _uploadService: FileUploadService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.EditData = this.config.data.itemData;
    // //consolethis.EditData);
    this.customToolbar = [
      // ["heading", "font_family", "font_size"],
      ["bold", "italic", "underline", "strike"],
      ["subscript", "superscript"],
      ["text_color", "background_color"],
      ["align_left", "align_center", "align_right", "align_justify"],
      ["ordered_list", "bullet_list", "indent", "outdent"],
      ["blockquote", "code"],
      ["link", "image", "horizontal_rule"],
      ["undo", "redo"],
    ];
    this.customToolbar_en = [
      // ["heading", "font_family", "font_size"],
      ["bold", "italic", "underline", "strike"],
      ["subscript", "superscript"],
      ["text_color", "background_color"],
      ["align_left", "align_center", "align_right", "align_justify"],
      ["ordered_list", "bullet_list", "indent", "outdent"],
      ["blockquote", "code"],
      ["link", "image", "horizontal_rule"],
      ["undo", "redo"],
    ];
  }

  ngOnInit(): void {
    this.createForm();
    this.setValueFormEdit(this.EditData);
    this.editor = new Editor();
    this.editor_en = new Editor();
  }

  // ✅ Xử lý file ảnh
  onFileNGX_EDITORSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;

        let imgHtml = "";

        if (this.imageAlign === "center") {
          imgHtml = `<p style="text-align:center;"><img src="${imageUrl}" style="max-width:100%; height:auto;"></p>`;
        } else {
          imgHtml = `<img src="${imageUrl}" style="float:${this.imageAlign}; margin:0 1em 1em 1em; max-width:200px; height:auto;">`;
        }

        const current = this.form.get("content")?.value || "";
        this.form.get("content")?.setValue(current + imgHtml);
      };
      reader.readAsDataURL(file);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.uploadImage = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.preview_upload = e.target?.result;
        // Optionally set a different form control if you want to track the image URL
        this.form.controls["image"].setValue(this.uploadImage.name); // or whatever value you want to store
      };
      reader.readAsDataURL(this.uploadImage);

      input.value = "";
    }
  }
  // ✅ Xử lý file ảnh
  onFileNGX_EDITORSelected_En(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;

        let imgHtml = "";

        if (this.imageAlign === "center") {
          imgHtml = `<p style="text-align:center;"><img src="${imageUrl}" style="max-width:100%; height:auto;"></p>`;
        } else {
          imgHtml = `<img src="${imageUrl}" style="float:${this.imageAlign}; margin:0 1em 1em 1em; max-width:200px; height:auto;">`;
        }

        const current = this.form.get("content")?.value || "";
        this.form.get("content_en")?.setValue(current + imgHtml);
      };
      reader.readAsDataURL(file);
    }
  }
  showField(fieldName: string): boolean {
    return this.config.data.fields.some(
      (field: { name: string }) => field.name === fieldName,
    );
  }

  createForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.config.data.fields.forEach((field: any) => {
      if (field.name == "status") {
        formGroupConfig["status"] = [true, Validators.required];
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
      this.preview_upload = this.stringurl + "/" + data.image;
    } else {
      this.isEditMode = false;
    }
  }

  onFilePDFSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
      input.value = "";
    }
  }

  async handleFileInput() {
    if (this.selectedPdfFile) {
      const pdfurl = await this._uploadService.postFile(this.selectedPdfFile);
      if (pdfurl) {
        this.form.controls["pdfurl"].clearValidators();
        this.form.controls["pdfurl"].updateValueAndValidity();
        this.item.pdfurl = pdfurl.file_save_url;
      }
    } else if (this.EditData.pdfurl) {
      this.form.controls["pdfurl"].clearValidators();
      this.form.controls["pdfurl"].updateValueAndValidity();
      this.item.pdfurl = this.EditData.pdfurl;
    }
    if (this.uploadImage) {
      const imageData = await this._uploadService.postFile(this.uploadImage);
      if (imageData.file_save_url) {
        this.form.controls["image"].clearValidators();
        this.form.controls["image"].updateValueAndValidity();
        this.item.image = imageData.file_save_url;
      }
    } else if (this.EditData.image) {
      this.form.controls["image"].clearValidators();
      this.form.controls["image"].updateValueAndValidity();
      this.item.image = this.EditData.image;
    }
  }

  async onSubmit(values: any) {
    await this.handleFileInput();
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
    this.item.status = true;
    const item_type = this.type_item.find(
      (i: any) => i.name === this.config.data.item_type,
    );
    if (item_type) {
      this.item.itemtype = item_type.id.toString();

      Object.keys(values).forEach((key) => {
        if (key !== "image" && key !== "pdfurl") {
          this.item[key] = values[key];
        }
      });
      this._dataService.post(StringAPI.APIDichvu, this.item).subscribe(
        (res) => {
          this.ref.close(res || []);
        },
        (error) => {},
      );
    }
  }

  onEdit(values: any) {
    if (this.EditData && this.EditData.id && values) {
      Object.keys(values).forEach((key) => {
        if (key !== "image" && key !== "pdfurl") {
          this.item[key] = values[key];
        }
      });
      this._dataService
        .put(StringAPI.APIDichvu + "/" + this.EditData.id, this.item)
        .subscribe(
          (res) => {
            this.ref.close(res || []);
          },
          (error) => {},
        );
    }
  }
}
