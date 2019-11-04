import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';


@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.component.html',
  styleUrls: ['./club-create.component.css']
})
export class ClubCreateComponent implements OnInit {

  // Above 2 variables are for carousel-sm component
  title = 'Create your own Club';
  description = 'To have matches, to be on Rank, to be on the Top of the World';

  invitedPlayers: any = [];
  playerSentToChild: any = {};

  constructor() { }

  ngOnInit() {
  }

  showInvitation(players: any) {
    this.invitedPlayers = players;
  }

  sendPlayerToRemove(player: any) {
    this.playerSentToChild = player;
    this.invitedPlayers = _.reject(this.invitedPlayers, { email: player.email });
  }

}
