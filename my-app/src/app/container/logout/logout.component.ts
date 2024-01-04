import { Component } from '@angular/core';
import { Rep, Message } from '../../models/response.interface';
import { UserService } from '../../service/user/user.service';
import { Router } from '@angular/router';
import { RefreshService } from '../../service/refresh.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(
    private _userService: UserService,
    private router: Router,
    private refreshService: RefreshService
    ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    const tokenData: string | null = localStorage.getItem('token');
    let token: string = '';

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      token = parsedTokenData.token;
    }

    if (token.length > 0) {
      this._userService.logout(token).subscribe(
        response => {
          if(response) {
            const responseMessage: Message = JSON.parse(response);

            if(responseMessage && responseMessage.message === 'Logout successful') {
              if(localStorage.getItem('token')) {
                localStorage.removeItem('token');
                this.refreshService.triggerRefresh();
                this.router.navigate(['/login']);
              }
            }
          }
        },
        (error) => {
          console.error('Logout failed:', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
