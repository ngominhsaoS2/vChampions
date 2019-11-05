import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-find-players',
  templateUrl: './find-players.component.html',
  styleUrls: ['./find-players.component.css']
})
export class FindPlayersComponent implements OnChanges, OnInit {

  criteria: any = {};
  foundPlayers: any = [];
  invitedPlayers: any = [];
  @Input() playerToRemove: any = {};
  @Output() invitation = new EventEmitter();

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const playerToRemove: SimpleChange = changes.playerToRemove;
    if (playerToRemove.currentValue !== playerToRemove.previousValue) {
      this.removePlayer(playerToRemove.currentValue);
    }
  }

  ngOnInit() {

  }

  findPlayers() {
    this.spinner.show();
    this.userService.findPlayers(this.criteria).subscribe(players => {
      this.foundPlayers = players;
      this.spinner.hide();
    }, err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  invitePlayer(player: any, position) {
    if (_.findIndex(this.invitedPlayers, { email: player.email }) < 0) {
      const playerToAdd = {
        id: player._id,
        title: 'player',
        name: player.name,
        email: player.email,
        positions: [position]
      };

      this.invitedPlayers.push(playerToAdd);
      this.toastr.success('Add ' + player.name + ' to invitation list successfully.');
    }

    this.invitation.emit(this.invitedPlayers);
  }

  removePlayer(player: any) {
    this.invitedPlayers = _.reject(this.invitedPlayers, { email: player.email });
  }

  checkAlreadyInvited(player: any) {
    if (_.findIndex(this.invitedPlayers, { email: player.email }) >= 0) {
      return true;
    }

    return false;
  }

}
