import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  isAuthenticated(): boolean {
    const tokenData = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.expiresAt) {
        const currentTime = new Date().getTime();
        const tokenExpiration = parsedTokenData.expiresAt;

        return currentTime <= tokenExpiration;
      }
    }

    return false;
  }

  hasAdminRole(): boolean {
    const tokenData = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);
      const userRole = parsedTokenData.connectedUser.role;

      return userRole === 'ADMIN';
    }

    return false;
  }
}
