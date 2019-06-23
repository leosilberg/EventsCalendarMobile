import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class EventsDataService {




  private eventsArray: Event[] = [];
  private loadedMonths: string[] = [];
  constructor(private http: HttpClient) { }

  attendEvent(id: string) {
    return this.http.get('https://events.hareshet.org.il/attendEvent.php?id=' + id + "&action=attend")
      .map((data: any) => {

      });
  }

  leaveEvent(id: string): any {
    return this.http.get('https://events.hareshet.org.il/attendEvent.php?id=' + id + "&action=leave")
      .map((data: any) => {

      });
  }

  getTags() {

    return this.http.get('https://events.hareshet.org.il/tags.php')
      .map((data: any) => {
        let tags: string[] = [];
        for (let i in data) {

          tags.push(data[i]);
        }
        return tags;
      });

  }

  searchTags(search: string): any {
    return this.http.get('https://events.hareshet.org.il/searchTags.php?search=' + search)
      .map((data: any) => {

        let tempEventsArray: Event[] = [];
        for (let key in data) {

          let temp = data[key];

          let img = "https://events.hareshet.org.il/uploads/" + key + ".jpg";
          tempEventsArray.push(new Event(key, temp["title"], temp["location"], temp["date"], temp["time"],temp["endtime"], temp["description"], img, temp["tags"], temp["numAttending"],temp["host"]));
        }

        return this.sort(tempEventsArray);
      });
  }

  countEvents(date: string) {
    let count = 0;
    for (let i in this.eventsArray) {
      if (this.eventsArray[i].$date == date) {
        count++;
      }
    }

    return count;
  }

  getDayEvents(date: string) {

    let temp: Event[] = [];
    for (let i in this.eventsArray) {
      if (this.eventsArray[i].$date == date) {
        temp.push(this.eventsArray[i]);
      }
    }
    return this.sort(temp);
  }

  getAllEvents(date: string) {

    let temp: Event[] = [];
    for (let i in this.eventsArray) {

      if (this.eventsArray[i].$date.substring(3) == date) {

        temp.push(this.eventsArray[i]);
      }

    }

    return this.sort(temp);
  }

  sort(temp: Event[]) {
    return temp.sort((obj1, obj2) => {
      if (moment(obj1.$date, 'DD/MM/YYYY').isAfter(moment(obj2.$date, 'DD/MM/YYYY'))) {
        return 1;
      } else {
        if (moment(obj1.$date, 'DD/MM/YYYY').isBefore(moment(obj2.$date, 'DD/MM/YYYY'))) {
          return -1;
        }
        else {
          if (moment(obj1.$time, 'HH:mm').isAfter(moment(obj2.$time, 'HH:mm'))) {
            return 1;
          }

          if (moment(obj1.$time, 'HH:mm').isBefore(moment(obj2.$time, 'HH:mm'))) {
            return -1;
          }

          return 0;
        }

      }
      return 0;
    });
  }

  checkLoaded(date: string) {
    if (!this.loadedMonths.includes(date)) {
      return false;
    }
    else {
      return true;
    }
  }
  downloadEvent(id:string){
    return this.http.get('https://events.hareshet.org.il/download.php?id=' +id)
      .map((data: any) => {
        let event:Event;
        for (let key in data) {

          let temp = data[key];
       
          let img = "https://events.hareshet.org.il/uploads/" + key + ".jpg";
       event=new Event(key, temp["title"], temp["location"], temp["date"], temp["time"],temp["endtime"], temp["description"], img, temp["tags"], temp["numAttending"],temp["host"]);
       
      }
      
        return event;
      });
  }

  dowloadEvents(date: string): Observable<Event[]> {
    console.log("Download " + date);
    this.loadedMonths.push(date);
    return this.http.get('https://events.hareshet.org.il/download.php?date=' + date.replace("/", ""))
      .map((data: any) => {

        for (let key in data) {
          let temp = data[key];
          let img = "https://events.hareshet.org.il/uploads/" + key + ".jpg";
          this.eventsArray.push(new Event(key, temp["title"], temp["location"], temp["date"], temp["time"],temp["endtime"], temp["description"], img, temp["tags"], temp["numAttending"],temp["host"]));
        }
        
        return this.eventsArray;
      });

  }

  submitEvent(title: string, location: string, date: string, time: string,endtime:string, description: string, image: any, tags: string[],recurring:string,host:string) {
    const formData = new FormData();
    var _data = {

      title: title,
      location: location,
      date: date,
      time: time,
      endtime:endtime,
      description: description,
      tags: tags,
      recurring:recurring,
      host:host,
      numAttending: 0
    }

    formData.append("data", JSON.stringify(_data));
    formData.append('img', image);
    this.http.post('https://events.hareshet.org.il/upload.php', formData)
      .subscribe(data => {
        console.log(data);
      })
  }


}


export class Event {
  private id: string;
  private title: string;
  private location: string;
  private date: string;
  private time: string;
  private endtime:string;
  private description: string;
  private image: string;
  private tags: string[] = [];
  private attending: boolean;
  private numAttending: string;
  private host: string;

  constructor(id: string, title: string, location: string, date: string, time: string,endtime:string,
    description: string, image: string, tags: string[] = [], numAttending: string, host: string) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.date = date;
    this.time = time;
    this.endtime=endtime;
    this.description = description;
    this.image = image;
    this.tags = tags;
    this.numAttending = numAttending;
    this.host = host;
    this.attending = localStorage.getItem(this.id) != null;
  }

  searchString(s: string) {
    if (this.host.toLocaleLowerCase().includes(s) ||this.title.toLocaleLowerCase().includes(s) || this.location.toLocaleLowerCase().includes(s) || this.description.toLocaleLowerCase().includes(s) || this.tags.includes(s)) {
      return true;
    }
    return false;
  }

  /**
   * Getter $id
   * @return {string}
   */
  public get $id(): string {
    return this.id;
  }

  /**
   * Setter $id
   * @param {string} value
   */
  public set $id(value: string) {
    this.id = value;
  }

  /**
   * Getter $title
   * @return {string}
   */
  public get $title(): string {
    return this.title;
  }

  /**
   * Setter $title
   * @param {string} value
   */
  public set $title(value: string) {
    this.title = value;
  }

  /**
   * Getter $location
   * @return {string}
   */
  public get $location(): string {
    return this.location;
  }

  /**
   * Setter $location
   * @param {string} value
   */
  public set $location(value: string) {
    this.location = value;
  }

  /**
   * Getter $date
   * @return {string}
   */
  public get $date(): string {
    return this.date;
  }

  /**
   * Setter $date
   * @param {string} value
   */
  public set $date(value: string) {
    this.date = value;
  }

  /**
   * Getter $time
   * @return {string}
   */
  public get $time(): string {
    return this.time;
  }

  /**
   * Setter $time
   * @param {string} value
   */
  public set $time(value: string) {
    this.time = value;
  }


    /**
     * Getter $endtime
     * @return {string}
     */
	public get $endtime(): string {
		return this.endtime;
	}

    /**
     * Setter $endtime
     * @param {string} value
     */
	public set $endtime(value: string) {
		this.endtime = value;
	}

  /**
   * Getter $descrption
   * @return {string}
   */
  public get $description(): string {
    return this.description;
  }

  /**
   * Setter $descrption
   * @param {string} value
   */
  public set $description(value: string) {
    this.description = value;
  }

  /**
     * Getter $image
     * @return {string}
     */
  public get $image(): string {
    return this.image;
  }

  /**
   * Setter $image
   * @param {string} value
   */
  public set $image(value: string) {
    this.image = value;
  }



  /**
   * Getter $tags
   * @return {string[]}
   */
  public get $tags(): string[] {
    return this.tags;
  }

  /**
   * Setter $tags
   * @param {string[]} value
   */
  public set $tags(value: string[]) {
    this.tags = value;
  }


  /**
   * Getter $attending
   * @return {boolean}
   */
  public get $attending(): boolean {
    return this.attending;
  }

  /**
   * Setter $attending
   * @param {boolean} value
   */
  public set $attending(value: boolean) {
    this.attending = value;
  }
  /**
   * Getter $numAttending
   * @return {string}
   */
  public get $numAttending(): string {
    return this.numAttending;
  }

  /**
   * Setter $numAttending
   * @param {string} value
   */
  public set $numAttending(value: string) {
    this.numAttending = value;
  }

  /**
   * Getter $host
   * @return {string}
   */
  public get $host(): string {
    return this.host;
  }

  /**
   * Setter $host
   * @param {string} value
   */
  public set $host(value: string) {
    this.host = value;
  }
}