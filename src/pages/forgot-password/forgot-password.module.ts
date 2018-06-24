import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ForgotPasswordPage} from './forgot-password';

@NgModule({
  declarations: [ForgotPasswordPage],
  imports: [
  	IonicPageModule.forChild(ForgotPasswordPage)
  ],
  entryComponents: [
  	ForgotPasswordPage
  ],
  providers: [
  ]
})
export class ForgotPasswordPageModule { }