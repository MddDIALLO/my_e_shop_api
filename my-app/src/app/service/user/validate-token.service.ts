import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenService {

  constructor() { }

  checkTokenValidity(): boolean {
    const tokenData = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);

      if (parsedTokenData && parsedTokenData.expiresAt) {
        const currentTime = new Date().getTime();
        const tokenExpiration = parsedTokenData.expiresAt;

        if (currentTime > tokenExpiration) {
          localStorage.removeItem('token');
          return false;
        } else {
          return true;
        }
      }
    }

    return false;
  }
}
