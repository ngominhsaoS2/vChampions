import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-find-players',
  templateUrl: './find-players.component.html',
  styleUrls: ['./find-players.component.css']
})
export class FindPlayersComponent implements OnInit {

  @Input() playersOnClub: any = [];
  @Output() playerToInvite = new EventEmitter();

  criteria: any = {};
  pageSize = 9;
  foundPlayers: any = [];
  totalItems: number;

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }

  findPlayers(page: number) {
    this.spinner.show();
    this.userService.findPlayers(this.criteria, this.pageSize, page).subscribe((res: any) => {
      this.foundPlayers = res.players;
      this.totalItems = res.totalItems;
      this.spinner.hide();
    }, err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  invitePlayer(player: any, position) {
    if (_.findIndex(this.playersOnClub, { email: player.email }) < 0) {
      const playerToAdd = {
        id: player._id,
        title: 'player',
        name: player.name,
        email: player.email,
        confirmation: 'received',
        positions: [position]
      };

      this.playerToInvite.emit(playerToAdd);

    } else {
      this.toastr.info(player.name + ' is your team member or already invited.');
    }
  }

  checkAlreadyInvited(player: any) {
    if (_.findIndex(this.playersOnClub, { email: player.email }) >= 0) {
      return true;
    }

    return false;
  }

}
