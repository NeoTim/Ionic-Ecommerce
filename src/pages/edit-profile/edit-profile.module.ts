import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EditProfilePage} from './edit-profile';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [EditProfilePage],
  imports: [
  	IonicPageModule.forChild(EditProfilePage)
  ],
  entryComponents: [
  	EditProfilePage
  ],
  providers: [
  	UserService
  ]
})
export class EditProfilePageModule { }