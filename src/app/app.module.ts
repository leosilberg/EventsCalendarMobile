import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from '@angular/common/http';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import {Ng6SocialButtonModule,SocialServiceConfig} from "ng6-social-button";

import {
  MatDialogModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatToolbarModule,
  MatMenuModule,
  MatCardModule,
  MatTableModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatListModule,
  MatExpansionModule,
  MatChipsModule,
  MatAutocomplete,
  MatAutocompleteModule,
  MAT_DATE_LOCALE,
  MatSnackBar,
  MatSnackBarModule,
  MatSelectModule
} from '@angular/material';

import { CalendarComponent } from './calendar/calendar.component';
import { DayCardComponent } from './calendar/day-card/day-card.component';
import { SubmitEventComponent } from './submit-event/submit-event.component';
import { EventsDataService } from './Services/events-data.service';
import { ViewEventsComponent } from './view-events/view-events.component';
import { EventComponent } from './event/event.component';




// Configs
export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
      .addFacebook("867654190238748")
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
   
    CalendarComponent,
    DayCardComponent,
    SubmitEventComponent,
    ViewEventsComponent,
    EventComponent,


  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatAutocompleteModule,
    MatSelectModule,
    AmazingTimePickerModule,
    HttpClientModule,
    FlexLayoutModule,
    Ng6SocialButtonModule,

  ],
  entryComponents: [],
  exports: [],
  providers: [EventsDataService,{ provide: MAT_DATE_LOCALE, useValue: 'he' },{provide: SocialServiceConfig,useFactory: getAuthServiceConfigs},],
  bootstrap: [AppComponent]
})
export class AppModule { }
