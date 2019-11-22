import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { ImageService } from 'src/app/services/image.service';

const URL = environment.apiUrl + 'images/add-image';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: any;
  registerForm: FormGroup;
  uploadImageResult: any;

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private imageService: ImageService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      roles: ['Player'],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(10), Validators.maxLength(14)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/), Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.spinner.show();

      this.user = Object.assign({}, this.registerForm.value);
      this.user.roles = [this.registerForm.value.roles];
      this.user.avatar = { publicId: this.uploadImageResult.public_id, version: this.uploadImageResult.version };

      this.authService.register(this.user).subscribe(() => {
        this.spinner.hide();
        this.router.navigate(['/login']);
        this.toastr.success('Registration successful. Please login to have the best experience!!!', 'Success');
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error, 'Error');
        console.log(error);
      });
    }
  }

  imageSelected(event) {
    this.spinner.show();

    const file: File = event[0];
    this.imageService.readAsBase64(file).then(base64Image => {
      if (base64Image) {
        this.imageService.addImage(base64Image).subscribe(result => {
          this.uploadImageResult = result;
          this.spinner.hide();
          console.log('uploadImageResult', this.uploadImageResult);
        }, err => {
          this.spinner.hide();
          console.log(err);
        });
      }
    }).catch(err => {
      this.spinner.hide();
      console.log(err);
    });
  }

}
