import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-find-players',
  templateUrl: './find-players.component.html',
  styleUrls: ['./find-players.component.css']
})
export class FindPlayersComponent implements OnInit {

  criteria: any = {};

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    
  }

  findPlayers() {

  }

}
