import { Component } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { Router } from '@angular/router';
import { RefreshService } from '../../service/refresh.service';
import { Rep } from '../../models/response.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  credentialIssue = false;
  reqIssue = false;
  reqIssueMessage = '';
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  }

  constructor(
    private _userService: UserService,
    private router: Router,
    private refreshService: RefreshService
    ) {}

  onSubmit() {
    if(this.email.length < 10 || this.password.length < 8) {
      this.credentialIssue = true;
      return;
    }

    this._userService.login(this.email, this.password).subscribe(
      response => {
        const responseData: Rep = JSON.parse(response);
        if (responseData.message && responseData.token) {
          this.connectedUser = responseData.connectedUser;

          const tokenExpiration = new Date().getTime() + 2 * 60 * 60 * 1000;
          const tokenData = {
            token: responseData.token,
            connectedUser: responseData.connectedUser,
            expiresAt: tokenExpiration,
          };

          if(localStorage.getItem('token')) {
            localStorage.removeItem('token');
          }

          localStorage.setItem('token', JSON.stringify(tokenData));
          this.refreshService.triggerRefresh();
          this.router.navigate(['/home']);
        }
      },
      error => {
        this.reqIssue = true;
        this.reqIssueMessage = error.error.message;
        console.error('Login failed:', error);
      }
    );
  }
}
