import { Injectable } from '@angular/core';

import { UserModel } from './user.model';

@Injectable()
export class AuthService {
  currentUser: UserModel | null;
  redirectUrl: string;

  constructor() { }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(userName: string, password: string): void {
    // TODO: Implement backend service
    this.currentUser = {
      id: 34,
      isAdmin: false,
      userName: userName,
    };
  }

  logout(): void {
    this.currentUser = null;
  }
}
