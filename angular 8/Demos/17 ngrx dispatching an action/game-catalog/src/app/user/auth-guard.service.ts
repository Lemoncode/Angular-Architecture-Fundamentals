import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    return this.checkLoggedIn(state.url);
  }

  checkLoggedIn(url: string): boolean {
    if(this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
