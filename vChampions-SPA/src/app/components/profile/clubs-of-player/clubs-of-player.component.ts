import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clubs-of-player',
  templateUrl: './clubs-of-player.component.html',
  styleUrls: ['./clubs-of-player.component.css']
})
export class ClubsOfPlayerComponent implements OnInit {

  @Input() enabled = true;
  @Input() clubs: any = [];
  @Output() reload = new EventEmitter();

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (this.enabled) {

    }
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
    this.userService.confirmInvitation(club._id, { confirmation: 'denined' }).subscribe(() => {
      this.toastr.success('You denied to be a member of FC ' + club.name);
      this.reload.emit();
    }, error => {
      this.toastr.error(error.error, 'Error');
      console.log(error);
    });
  }

}
