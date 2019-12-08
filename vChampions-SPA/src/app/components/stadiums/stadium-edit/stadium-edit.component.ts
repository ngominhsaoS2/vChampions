import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { StadiumService } from 'src/app/services/stadium.service';
import { ImageService } from 'src/app/services/image.service';
import * as _ from 'lodash';

const URL = environment.apiUrl + 'images/add-image';
const folderStadium = environment.folderStadium;

@Component({
  selector: 'app-stadium-edit',
  templateUrl: './stadium-edit.component.html',
  styleUrls: ['./stadium-edit.component.css']
})
export class StadiumEditComponent implements OnInit {

  defaultStadium = environment.defaultStadium;
  stadium: any;

  editStadiumForm: FormGroup;
  yards: any = [];
  yardName = '';

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private stadiumService: StadiumService,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.stadium = data.stadium;
      this.yards = this.stadium.yards;
    });

    this.initEditStadiumForm(this.stadium);
  }

  initEditStadiumForm(stadium: any) {
    this.editStadiumForm = this.fb.group({
      name: [stadium.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: [stadium.address, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  saveChangesStadium() {
    if (this.editStadiumForm.valid && this.yards.length > 0) {
      this.spinner.show();

      const stadium = Object.assign({}, this.editStadiumForm.value);
      stadium._id = this.stadium._id;
      stadium.yards = this.yards;
      stadium.logo = { publicId: this.stadium.logo.publicId, version: this.stadium.logo.version };

      this.stadiumService.editStadium(stadium).subscribe(() => {
        this.spinner.hide();
        this.router.navigate(['/stadium/manage/', stadium._id]);
        this.toastr.success('Edit Stadium successfully.', 'Success');
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error, 'Error');
        console.log(error);
      });
    }
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

  imageSelected(event) {
    this.spinner.show();

    const file: File = event[0];
    this.imageService.readAsBase64(file).then(base64Image => {
      if (base64Image) {
        this.imageService.addImage(base64Image, folderStadium).subscribe((result: any) => {
          this.stadium.logo = { publicId: result.public_id, version: result.version };
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
