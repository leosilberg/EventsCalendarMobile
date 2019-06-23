import { Component, OnInit, Input } from '@angular/core';
import { Day } from '../calendar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-day-card',
  templateUrl: './day-card.component.html',
  styleUrls: ['./day-card.component.scss']
})
export class DayCardComponent implements OnInit {
  numEvents:number=5;
  
@Input()day:Day;
  constructor() { }

  ngOnInit() {
  }


}
