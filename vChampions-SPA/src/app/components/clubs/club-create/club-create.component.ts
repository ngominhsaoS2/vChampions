import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { ClubService } from 'src/app/services/club.service';
import { environment } from 'src/environments/environment';

const defaultLogo = environment.defaultLogo;

@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.component.html',
  styleUrls: ['./club-create.component.css']
})
export class ClubCreateComponent implements OnInit {

  loggedInUser: any = {};
  invitedPlayers: any = [];

  createClubForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private authService: AuthService,
    private clubService: ClubService
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.decodedToken;
    this.initCreateClubForm();
  }

  initCreateClubForm() {
    this.createClubForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^\S*$/)]], /* no space */
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      city: ['', Validators.required],
      district: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  showPlayers(player: any) {
    this.invitedPlayers.push(player);
    this.toastr.success('Sent an invitation to ' + player.name + ' to join the Club successfully.');
  }

  removePlayerFromInvitation(player: any) {
    this.invitedPlayers = _.reject(this.invitedPlayers, { email: player.email });
  }

  createClub() {
    if (this.createClubForm.valid && this.invitedPlayers.length > 0) {
      this.spinner.show();

      const club = Object.assign({}, this.createClubForm.value);
      club.logo = defaultLogo;
      club.managerId = this.loggedInUser._id;
      club.players = this.invitedPlayers;

      // Cho captain default là DF
      club.players.push({
        id: this.loggedInUser._id,
        title: 'captain',
        positions: ['DF']
      });

      this.clubService.createClub(club).subscribe(() => {
        this.spinner.hide();
        this.router.navigate(['/club/manage-list']);
        this.toastr.success('Create Club successfully.', 'Success');
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error, 'Error');
        console.log(error);
      });
    }
  }

}
