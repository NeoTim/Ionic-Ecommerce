import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyAccountPage} from './my-account';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [MyAccountPage],
  imports: [
  	IonicPageModule.forChild(MyAccountPage)
  ],
  entryComponents: [
  	MyAccountPage
  ],
  providers: [
  	UserService
  ]
})
export class MyAccountPageModule { }