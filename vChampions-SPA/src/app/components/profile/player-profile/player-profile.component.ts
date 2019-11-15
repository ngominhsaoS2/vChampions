import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TabDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  title = 'Name of the Player';
  description = 'Description';

  player: any;
  tab: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.tab = 'Clubs';

    this.route.data.subscribe(data => {
      this.player = data.player;
      this.title = this.player.name;
      this.description = 'Contact: ' + this.player.phone + ' / ' + this.player.email;
    });
  }

  onSelect(data: TabDirective): void {
    this.tab = data.heading;
  }

  reloadPlayer() {
    this.userService.getLoggedInUser().subscribe(player => {
      this.player = player;
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

}
