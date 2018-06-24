import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginPage} from './login';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [LoginPage],
  imports: [
  	IonicPageModule.forChild(LoginPage)
  ],
  entryComponents: [
  	LoginPage
  ],
  providers: [
  	UserService
  ]
})
export class LoginPageModule { }