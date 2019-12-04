import { Component, OnInit, Input } from '@angular/core';
import { StadiumService } from 'src/app/services/stadium.service';

@Component({
  selector: 'app-stadiums-of-owner',
  templateUrl: './stadiums-of-owner.component.html',
  styleUrls: ['./stadiums-of-owner.component.css']
})
export class StadiumsOfOwnerComponent implements OnInit {

  @Input() enabled = false;
  stadiums: any = [];

  constructor(
    private stadiumService: StadiumService
  ) { }

  ngOnInit() {
    if (this.enabled) {
      this.getStadiumsManagedByYou();
    }
  }

  getStadiumsManagedByYou() {
    this.stadiumService.getStadiumsManagedByYou().subscribe((data: any) => {
      this.stadiums = data;
    }, error => {
      console.log(error);
    });
  }

}
