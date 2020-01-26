import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string;
  pageTitle = 'Log In'

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const { userName, password} = loginForm.form.value;
      // TODO: Implement as async / await
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        // TODO: Navigate to games
      }
    }
  }

}
