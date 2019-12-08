import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { StadiumService } from 'src/app/services/stadium.service';
import { ImageService } from 'src/app/services/image.service';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';

const URL = environment.apiUrl + 'images/add-image';
const folderStadium = environment.folderStadium;

@Component({
  selector: 'app-stadium-create',
  templateUrl: './stadium-create.component.html',
  styleUrls: ['./stadium-create.component.css']
})
export class StadiumCreateComponent implements OnInit {

  createStadiumForm: FormGroup;
  yards: any = [];
  yardName = '';
  uploadImageResult: any;
  defaultStadium = environment.defaultStadium;

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private stadiumService: StadiumService,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.initCreateStadiumForm();
  }

  initCreateStadiumForm() {
    this.createStadiumForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  addYard() {
    if (this.yardName === '') {
      this.toastr.error('Please provide yard name');
      return;
    }

    if (_.findIndex(this.yards, { name: this.yardName }) < 0) {
      this.yards.push({ name: this.yardName });
      this.yardName = '';
    } else {
      this.toastr.info(this.yardName + ' is already added.');
    }
  }

  removeYard(yard: any) {
    this.yards = _.reject(this.yards, { name: yard.name });
  }

  createStadium() {
    if (this.createStadiumForm.valid && this.yards.length > 0) {
      this.spinner.show();

      const stadium = Object.assign({}, this.createStadiumForm.value);
      stadium.yards = this.yards;
      if (this.uploadImageResult) {
        stadium.logo = { publicId: this.uploadImageResult.publicId, version: this.uploadImageResult.version };
      } else {
        stadium.logo = this.defaultStadium;
      }

      this.stadiumService.createStadium(stadium).subscribe(() => {
        this.spinner.hide();
        this.router.navigate(['/profile/StadiumOwner']);
        this.toastr.success('Create Stadium successfully.', 'Success');
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
        this.imageService.addImage(base64Image, folderStadium).subscribe((result: any) => {
          this.uploadImageResult = { publicId: result.public_id, version: result.version };
          this.spinner.hide();
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
