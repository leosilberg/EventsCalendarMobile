import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { EventsDataService, Event } from '../Services/events-data.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, share } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatInput, MatSnackBar } from '@angular/material';
import { SocialService } from 'ng6-social-button';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
 searchBar:boolean=false;
  tagOptions: string[] = [];
  filteredOptions: string[];

  currentDate = moment();
  selectedDate: moment.Moment;

  eventsArray: Event[] = [];
  copyEventsArray: Event[] = [];


  constructor(private service: EventsDataService, private snackBar: MatSnackBar, private route: ActivatedRoute, private socialAuthService: SocialService) {
    this.service.getTags().subscribe(data => {

      this.tagOptions = data;
      this.filteredOptions = this.tagOptions;
    });
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      if (params['date']) {
        this.selectedDate = moment(params["date"], 'DD/MM/YYYY');

      }
    });

    if (this.selectedDate) {
      this.refreshDay();
    } else {
      this.refresh();
    }

  }
  refreshDay(): any {
    let date = this.selectedDate.format('MM') + "/" + this.selectedDate.format('YYYY');

    if (this.service.checkLoaded(date)) {
      this.eventsArray = this.service.getDayEvents(this.selectedDate.format("DD") + "/" + date);
      this.copyEventsArray = this.eventsArray;
    } else {
      this.service.dowloadEvents(date).subscribe(
        data => {
          this.eventsArray = this.service.getDayEvents(this.selectedDate.format("DD") + "/" + date);
          this.copyEventsArray = this.eventsArray;
        });
    }
  }
  prevDay(): void {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'day');
    this.refreshDay();
  }

  nextDay(): void {
    this.selectedDate = moment(this.selectedDate).add(1, 'day');
    this.refreshDay();
  }
  refresh() {
    let date = this.currentDate.format('MM') + "/" + this.currentDate.format('YYYY');

    if (this.service.checkLoaded(date)) {
      this.eventsArray = this.service.getAllEvents(date);
      this.copyEventsArray = this.eventsArray;
    } else {
      this.service.dowloadEvents(date).subscribe(
        data => {
          this.eventsArray = this.service.getAllEvents(date);
          this.copyEventsArray = this.eventsArray;
        });
    }
  }

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.refresh();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.refresh();
  }

  attendEvent(event: Event) {


    //if (localStorage.getItem("googleLogin")) {
    this.service.attendEvent(event.$id).subscribe(
      data => {
        //   this.gapiService.insertEvent(event);
        let url = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.$title + 
        "&dates="+ moment(event.$date,"DD/MM/YYYY").format("YYYYMMDD")+"T"+event.$time.replace(":","")
        +"00/"+moment(event.$date,"DD/MM/YYYY").format("YYYYMMDD")+"T"+event.$endtime.replace(":","")
        +"00&details=https://events.hareshet.org.il%2Fevent%2F"+ event.$id
        +"&location=" + event.$location;
        window.open(url);
        localStorage.setItem(event.$id, " ");
        event.$attending = true;
        event.$numAttending = "" + (Number(event.$numAttending) + 1);
      });


    /*}else{
      this.snackBar.open('התחבר', '', {duration: 1000});
    }*/

  }

  leaveEvent(event: Event) {
    this.service.leaveEvent(event.$id).subscribe(
      data => {
        localStorage.removeItem(event.$id);
        event.$attending = false;

        event.$numAttending = "" + (Number(event.$numAttending) - 1);
      });

  }
  searchTags: boolean = false;
  search: string;
  searchString() {
   
    if (this.filteredOptions.includes(this.search)) {
      this.searchTags = true;
      this.searchTag();
    } else {
      this.searchTags = false;
      if (this.search != "") {
        this.filteredOptions = this._filter(this.search);
        this.eventsArray = [];
        for (let i in this.copyEventsArray) {
          if (this.copyEventsArray[i].searchString(this.search)) {
            this.eventsArray.push(this.copyEventsArray[i]);
          }
        }
      } else {
        this.filteredOptions = this.tagOptions;
        this.eventsArray = this.copyEventsArray;
      }
    }
  }

  searchTag() {

    this.service.searchTags(this.search).subscribe(
      data => {
        this.eventsArray = data;

      });
  }

  public shareEvent(event: Event) {

    let url = "https://www.facebook.com/sharer.php?u=https://events.hareshet.org.il/event/" + event.$id;
    window.open(url);
  }


}
