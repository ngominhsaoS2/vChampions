import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-manage',
  templateUrl: './club-manage.component.html',
  styleUrls: ['./club-manage.component.css']
})
export class ClubManageComponent implements OnInit {

  title = 'Name of the Club';
  description = 'Description';

  club: any;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.club = data.club;
      this.title = this.club.name;
      this.description = 'Manager: ' + this.club.manager.name + ' - ' + this.club.manager.phone + ' / ' + this.club.manager.email;
    });
  }

}
