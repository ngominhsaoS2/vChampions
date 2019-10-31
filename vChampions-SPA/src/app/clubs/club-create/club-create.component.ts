import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.component.html',
  styleUrls: ['./club-create.component.css']
})
export class ClubCreateComponent implements OnInit {

  // Above 2 variables are for carousel-sm component
  title = 'Create your own Club';
  description = 'To have matches, to be on Rank, to be on the Top of the World';

  constructor() { }

  ngOnInit() {
  }

}
