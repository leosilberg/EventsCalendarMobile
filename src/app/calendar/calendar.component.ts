import { Router, NavigationEnd } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatTableDataSource, MatTable, MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material';
import { EventsDataService } from '../Services/events-data.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})



export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('dataTable') dataTable: MatTable<any>;
  dataSource: MatTableDataSource<Week>;
  columnsToDisplay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  currentDate = moment();

  month: Week[] = [];

  sortedDates: Day[] = [];

  @Input() selectedDates: Day[] = [];
  @Output() onSelectDate = new EventEmitter<Day>();


  constructor(private router: Router, private renderer: Renderer2, private service: EventsDataService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    
    setTimeout(() => {
    }, 1);

    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: Day) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }

  // date checkers

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: Day): void {
    this.onSelectDate.emit(date);
  }

  // actions from calendar

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  hoverEvent: Event;
  hover(day: Day, event: Event) {


    if (day.eventCount != 0) {
      this.renderer.setStyle(event.target, 'box-shadow', ' 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)');
      this.hoverEvent = event;
      const config = new MatSnackBarConfig();
      config.direction = "rtl";
      config.panelClass = ['snackbar'];
      config.data = { day: day };
      config.horizontalPosition = "center";
      config.verticalPosition = "top";
    }
  }

  leaveHover() {
    if (this.hoverEvent) {

      this.renderer.setStyle(this.hoverEvent.target, 'box-shadow', 'none');
      this.hoverEvent = null;
    }

  }
  onDayClick(day: Day): void {
    if (day.sameMonth || day.eventCount!=0) {
      this.router.navigate(['/viewevents', day.mDate.format("DD/MM/YYYY")]);
    } else {

      if (day.mDate.isBefore(moment(this.currentDate))) {

        this.currentDate = moment(this.currentDate).subtract(1, 'months');
      }
      else {

        this.currentDate = moment(this.currentDate).add(1, 'months');
      }
 
      this.generateCalendar();
    }
  }

  // generate the calendar grid

  generateCalendar(): void {
   
    let requestsArr: any[] = [];
    let prevDate = moment(this.currentDate).subtract(1, 'months');
    let pDate = prevDate.format('MM') + "/" + prevDate.format('YYYY');
    if (!this.service.checkLoaded(pDate)) {
      requestsArr.push(this.service.dowloadEvents(pDate));
    }
    let nextDate = moment(this.currentDate).add(1, 'months');
    let nDate = nextDate.format('MM') + "/" + nextDate.format('YYYY');
    if (!this.service.checkLoaded(nDate)) {
      requestsArr.push(this.service.dowloadEvents(nDate));
    }
    let date = this.currentDate.format('MM') + "/" + this.currentDate.format('YYYY');
    if (!this.service.checkLoaded(date)) {
      requestsArr.push(this.service.dowloadEvents(date));
    }


    if (requestsArr.length != 0) {
      let requests = forkJoin(requestsArr);
      requests.subscribe(
        data => {
        
          this.refreshCalendar();
        });
    }
    
      this.refreshCalendar();


  }
  refreshCalendar() {
    this.month = [];
    const dates = this.fillDates(this.currentDate);
    while (dates.length > 0) {
      this.month.push(new Week(dates.splice(0, 7)));
    }

    this.dataSource = new MatTableDataSource<Week>(this.month);
    this.dataTable.renderRows();
  }

  fillDates(currentMoment: moment.Moment): Day[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): Day => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          sameMonth: this.isSelectedMonth(d),
          mDate: d,
          eventCount: this.service.countEvents(d.format("DD/MM/YYYY"))
        };
      });
  }

}

export class Day {
  mDate: moment.Moment;
  selected?: boolean;
  sameMonth?: boolean;
  today?: boolean;
  eventCount: number;
}

class Week {
  week: Day[] = [];
  constructor(w: Day[]) {
    this.week = w;
  }

  public getDay(i: number): Day {
    return this.week[i];
  }
}