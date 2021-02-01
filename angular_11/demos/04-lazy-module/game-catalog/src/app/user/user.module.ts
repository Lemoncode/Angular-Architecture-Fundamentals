import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
    ])
  ],
  providers: [
    AuthService,
    AuthGuardService,
  ]
})
export class UserModule { }
