import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RegisterPage} from './register';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [RegisterPage],
  imports: [
  	IonicPageModule.forChild(RegisterPage)
  ],
  entryComponents: [
  	RegisterPage
  ],
  providers: [
  	UserService
  ]
})
export class RegisterPageModule { }