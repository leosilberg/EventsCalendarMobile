import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { SubmitEventComponent } from './submit-event/submit-event.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { EventComponent } from './event/event.component';


const routes: Routes = [{ path: 'calendar', component: CalendarComponent },
{ path: '', component: ViewEventsComponent },
{ path: 'viewevents', component: ViewEventsComponent },
{ path: 'viewevents/:date', component: ViewEventsComponent },
{ path: 'event/:id', component: EventComponent },
{ path: 'submitevent', component: SubmitEventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
