import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-club-view',
  templateUrl: './club-view.component.html',
  styleUrls: ['./club-view.component.css']
})
export class ClubViewComponent implements OnInit {

  title = 'Name of the Club';
  description = 'Description';

  club: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.club = data.club;
      this.title = this.club.name;
      this.description = 'Manager: ' + this.club.manager.name + ' - ' + this.club.manager.phone + ' / ' + this.club.manager.email;
    });
  }

}
