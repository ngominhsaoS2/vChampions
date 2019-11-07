import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-club-manage',
  templateUrl: './club-manage.component.html',
  styleUrls: ['./club-manage.component.css']
})
export class ClubManageComponent implements OnInit {

  clubs = [];

  constructor(
    private clubService: ClubService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.getClubsManagedByYou();
  }

  getClubsManagedByYou() {
    this.spinner.show();

    this.clubService.getClubsManagedByYou().subscribe((clubs: any) => {
      this.clubs = clubs;
      console.log(clubs);
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

}
