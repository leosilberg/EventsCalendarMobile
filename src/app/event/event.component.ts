import { Component, OnInit } from '@angular/core';
import { EventsDataService, Event } from '../Services/events-data.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from 'ng6-social-button';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  show:boolean=null;



  eventsArray: Event[] = [];



  constructor(private service: EventsDataService, private snackBar: MatSnackBar,private route: ActivatedRoute,private socialAuthService: SocialService) {

  }



  ngOnInit() {

    this.route.params.subscribe(params => {

      if (params['id']) {
        this.service.downloadEvent(params['id']).subscribe(
          data => {
            this.eventsArray.push(data);
          });

      }
    });

  }



  attendEvent(event: Event) {


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



  }

  leaveEvent(event: Event) {
    this.service.leaveEvent(event.$id).subscribe(
      data => {
        localStorage.removeItem(event.$id);
        event.$attending = false;

        event.$numAttending = "" + (Number(event.$numAttending) - 1);
      });

  }

  public shareEvent(event: Event) {
    let url = "https://www.facebook.com/sharer.php?u=https://events.hareshet.org.il/event/" + event.$id;
    window.open(url);
  }

}
