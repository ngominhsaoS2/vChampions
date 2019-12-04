import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClubService } from 'src/app/services/club.service';

@Component({
  selector: 'app-clubs-of-player',
  templateUrl: './clubs-of-player.component.html',
  styleUrls: ['./clubs-of-player.component.css']
})
export class ClubsOfPlayerComponent implements OnInit {

  @Input() enabled = false;
  @Input() clubs: any = [];
  @Output() reload = new EventEmitter();

  clubsManged: any = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private clubService: ClubService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (this.enabled) {
      this.clubs = _.filter(this.clubs, (c) => {
        return c.confirmation !== 'denied';
      });

      this.getClubsManagedByYou();
    }
  }

  getClubsManagedByYou() {
    this.clubService.getClubsManagedByYou().subscribe((clubs: any) => {
      this.clubsManged = clubs;
    }, error => {
      console.log(error);
    });
  }

  acceptInvitation(club: any) {
    this.userService.confirmInvitation(club._id, { confirmation: 'accepted' }).subscribe(() => {
      this.toastr.success('You are member of FC ' + club.name + ' now');
      this.reload.emit();
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  denyInvitation(club: any) {
    this.userService.confirmInvitation(club._id, { confirmation: 'denied' }).subscribe(() => {
      this.toastr.success('You denied to be a member of FC ' + club.name);
      this.reload.emit();
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  viewClub(club: any) {
    this.router.navigate(['/club/view/', club.code]);
  }

}
