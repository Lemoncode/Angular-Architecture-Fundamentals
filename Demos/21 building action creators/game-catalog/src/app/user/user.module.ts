import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

import { SharedModule } from '../shared/shared.module';

/*NgRx*/
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('user', reducer),
    RouterModule.forChild([
      { path: 'login', component: LoginComponent }
    ])
  ],
  declarations: [LoginComponent],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class UserModule { }
