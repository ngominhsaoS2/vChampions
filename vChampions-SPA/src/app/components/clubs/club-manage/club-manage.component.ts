import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-club-manage',
  templateUrl: './club-manage.component.html',
  styleUrls: ['./club-manage.component.css']
})
export class ClubManageComponent implements OnInit {

  title = 'Name of the Club';
  description = 'Description';
  defaultAvatar = environment.defaultAvatar;

  club: any;
  playerToInvite: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.club = data.club;
      this.title = this.club.name;
      this.description = 'Manager: ' + this.club.manager.name + ' - ' + this.club.manager.phone + ' / ' + this.club.manager.email;
    });
  }

  invitePlayer(player: any) {
    this.spinner.show();
    this.clubService.invitePlayers(this.club._id, { players: [player] }).subscribe(() => {
      this.reloadClub(); // reload the Club after invite Player
      this.toastr.success('Sent an invitation to ' + player.name + ' to join the Club successfully.');
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  removePlayer(player: any) {
    this.clubService.removePlayer(this.club._id, player._id).subscribe(() => {
      this.reloadClub(); // reload the Club after remove Player
      this.toastr.success('Removed ' + player.name + ' from the Club.');
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  reloadClub() {
    this.clubService.getClubInManagerView(this.club.code).subscribe((updatedClub: any) => {
      this.club = updatedClub;
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  setAsCaptain(player: any) {
    this.clubService.setAsCaptain(this.club._id, player._id).subscribe(() => {
      this.reloadClub(); // reload the Club after set Captain
      this.toastr.success(player.name + ' is the Captain of the Club from now.');
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

  changePosition(player: any, position: string) {
    this.clubService.changePosition(this.club._id, player._id, position).subscribe(() => {
      this.reloadClub(); // reload the Club after change postion of a Player
      this.toastr.success(player.name + ' plays as ' + position + ' now.');
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

}
