import { Component } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SubmitEventComponent } from './submit-event/submit-event.component';
import { SocialService, FacebookLoginProvider, GoogleLoginProvider } from "ng6-social-button";
import { SocialUser } from 'ng6-social-button/lib/entities';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EventsCalendar';
  facebookUser: SocialUser;
  googleUser: SocialUser;

  constructor(public dialog: MatDialog, private socialAuthService: SocialService) {
    localStorage.removeItem("googleLogin");
    localStorage.removeItem("facebookLogin");
  }

  ngOnInit() {
  }



  signOut() {
    if (localStorage.getItem("facebookLogin")) {
      this.socialAuthService.signOut();
        this.googleUser = null;
        this.facebookUser = null;
        localStorage.removeItem("googleLogin");
        localStorage.removeItem("facebookLogin");
    
    }
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_TYPE;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_TYPE;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (user) => {
        if (socialPlatform == "facebook") {

          this.facebookUser = user;
          localStorage.setItem("facebookLogin", " ");
          
        }
        
        /*else if (socialPlatform == "google") {

          this.googleUser = user;
          localStorage.setItem("googleLogin", " ");
        }*/

       
        // Now sign-in with facebookUserData

      });
  }




  login() {
    if (!localStorage.getItem("facebookLogin")) {
    this.socialSignIn('facebook');
    }
    // this.socialSignIn('google');
    if (!localStorage.getItem("googleLogin")) {
    //this.gapiService.login();
    }

  }
  
  onClickSubmitEvent() {
    if (this.facebookUser) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { facebookUser: this.facebookUser };

      const dialogRef = this.dialog.open(SubmitEventComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        data => {

        }
      );
    } else {
      this.login();
    }
  }
}
