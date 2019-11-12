import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

  title = 'Top Players';
  description = 'The best of the best';

  topPlayers: any = [];
  beePlayers: any = [];

  criteria: any = {};
  pageSize: number = environment.pageSize;
  foundPlayers: any = [];
  totalItems: number;
  selectedPlayer: any;

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

  briefShowPlayer(player: any) {
    this.selectedPlayer = player;
  }

}
