import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TabDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-profile-owner',
  templateUrl: './profile-owner.component.html',
  styleUrls: ['./profile-owner.component.css']
})
export class ProfileOwnerComponent implements OnInit {

  title = 'Name of the Stadium Owner';
  description = 'Description';

  owner: any;
  tab: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.tab = 'Stadiums';

    this.route.data.subscribe(data => {
      this.owner = data.owner;
      this.title = this.owner.name;
      this.description = 'Contact: ' + this.owner.phone + ' / ' + this.owner.email;
    });
  }

  onSelect(data: TabDirective): void {
    this.tab = data.heading;
  }

}
