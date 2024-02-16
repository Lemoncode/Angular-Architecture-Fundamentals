import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: 'login', component: LoginComponent }]),
  ],
  providers: [AuthService]
})
export class UserModule {}
