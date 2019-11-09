import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {

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
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

}
