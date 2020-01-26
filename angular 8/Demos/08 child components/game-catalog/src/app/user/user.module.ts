import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent }
    ])
  ],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class UserModule { }
