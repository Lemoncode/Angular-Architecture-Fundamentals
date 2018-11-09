import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

/*NgRx*/
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  pageTitle = 'Log In';

  maskUserName: boolean;

  constructor(
    private store: Store<any>,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select('user')
    ).subscribe((u) => {
      if (u) {
        this.maskUserName = u.maskUserName;
      }
    })
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    this.store.dispatch({
      type: 'MASK_USER_NAME',
      payload: value,
    })
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const { userName, password} = loginForm.form.value;
      // TODO: Implement as async / await
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/games']);
      }
    }
  }

}
