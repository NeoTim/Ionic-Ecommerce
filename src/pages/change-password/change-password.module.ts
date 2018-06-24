import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChangePasswordPage} from './change-password';
import {UserService} from '../../services/user-service';


@NgModule({
  declarations: [ChangePasswordPage],
  imports: [
  	IonicPageModule.forChild(ChangePasswordPage)
  ],
  entryComponents: [
  	ChangePasswordPage
  ],
  providers: [
  	UserService
  ]
})
export class ChangePasswordPageModule { }