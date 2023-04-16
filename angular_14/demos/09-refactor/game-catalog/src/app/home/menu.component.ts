import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      .nav-full-width {
        width: 80%;
      }
      
      .nav-end {
        margin-left: auto;
      }
      
      .navbar-nav > li {
        margin-right: 1rem;
      }
    `,
  ],
})
export class MenuComponent implements OnInit {
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return "";
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  logOut(): void {
    this.authService.logout();
    this.router.navigate(["/welcome"]);
  }
}
