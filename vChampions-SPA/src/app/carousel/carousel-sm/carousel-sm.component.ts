import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-carousel-sm',
  templateUrl: './carousel-sm.component.html',
  styleUrls: ['./carousel-sm.component.css']
})
export class CarouselSmComponent implements OnInit {

  @Input() title: string; // pass param từ parent component đến child component
  @Input() description: string;

  constructor() { }

  ngOnInit() {

  }

}
