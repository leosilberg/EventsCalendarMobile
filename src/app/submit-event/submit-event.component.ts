import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { EventsDataService } from '../Services/events-data.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { SocialUser } from 'ng6-social-button/lib/entities';


@Component({
  selector: 'app-submit-event',
  templateUrl: './submit-event.component.html',
  styleUrls: ['./submit-event.component.scss']
})
export class SubmitEventComponent implements OnInit {
  
facebookUser:SocialUser;

  constructor(public dialogRef: MatDialogRef<SubmitEventComponent>,
    @Inject(MAT_DIALOG_DATA) params, private service: EventsDataService,
    private atp: AmazingTimePickerService, private snackBar: MatSnackBar) {
    this.facebookUser=params.facebookUser;
  }

  ngOnInit() {

  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  image: any;
  imageFile: any;
  title: string;
  location: string;
  date: Date;
  time: string;
  endtime:string;
  description: string;
  recurring:string;

  onFileSelected(event) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.image = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.imageFile = event.target.files[0];
  }
  dateChange(event: any) {
    this.date = event.target.value;

  }
  timeChange(event: any) {

    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.time = time;
    });

  }

  endtimeChange(event: any) {

    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.endtime = time;
    });

  }
  errormessage: string;
  onOKClick() {
    if (this.title && this.location && this.date && this.time && this.description && this.recurring && this.imageFile) {

      this.service.submitEvent(this.title, this.location, this.date.toLocaleDateString('en-GB'), this.time,this.endtime, this.description, this.imageFile, this.tags,this.recurring,this.facebookUser.name);

     
      this.dialogRef.close();
  

    } else {
      this.errormessage = "נא למלא את כל התשומות"
    }
  }

  onCancelClick() {
   
    
      this.dialogRef.close();
   
  }


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
