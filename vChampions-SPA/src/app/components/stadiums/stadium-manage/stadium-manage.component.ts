import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/services/club.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stadium-manage',
  templateUrl: './stadium-manage.component.html',
  styleUrls: ['./stadium-manage.component.css']
})
export class StadiumManageComponent implements OnInit {

  defaultStadium = environment.defaultStadium;
  stadium: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.stadium = data.stadium;
    });
  }

}
