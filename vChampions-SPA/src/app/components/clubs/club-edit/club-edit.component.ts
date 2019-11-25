import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from 'src/app/services/image.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

const URL = environment.apiUrl + 'images/add-image';

@Component({
  selector: 'app-club-edit',
  templateUrl: './club-edit.component.html',
  styleUrls: ['./club-edit.component.css']
})
export class ClubEditComponent implements OnInit {

  title = 'Name of the Club';
  description = 'Description';

  loggedInUser: any = {};

  club: any;
  editClubForm: FormGroup;
  logo: any;

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private clubService: ClubService,
    private imageService: ImageService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.decodedToken;

    this.route.data.subscribe(data => {
      this.club = data.club;
      this.logo = data.club.logo;
      this.title = this.club.name;
      this.description = 'Manager: ' + this.club.manager.name + ' - ' + this.club.manager.phone + ' / ' + this.club.manager.email;

      this.initEditClubForm(this.club);
    });
  }

  initEditClubForm(club: any) {
    this.editClubForm = this.fb.group({
      code: [club.code, [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^\S*$/)]],
      name: [club.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      city: [club.city, Validators.required],
      district: [club.district, Validators.required],
      description: [club.description, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  saveChangesClub(clubId) {
    if (this.editClubForm.valid) {
      this.spinner.show();

      const club = Object.assign({}, this.editClubForm.value);
      club._id = clubId;
      club.managerId = this.loggedInUser._id;
      club.logo = { publicId: this.logo.publicId, version: this.logo.version };
      club.players = [];

      this.clubService.editClub(club).subscribe(() => {
        this.spinner.hide();
        this.router.navigate(['/club/manage/', club.code]);
        this.toastr.success('Edit Club successfully.', 'Success');
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
        this.imageService.addImage(base64Image).subscribe((result: any) => {
          this.logo = { publicId: result.public_id, version: result.version };
          this.spinner.hide();
          console.log('logo', this.logo);
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
