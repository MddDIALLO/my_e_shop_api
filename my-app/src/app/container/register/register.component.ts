import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { UserService } from '../../service/user/user.service';
import { RefreshService } from '../../service/refresh.service';
import { Rep } from '../../models/response.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    role: '',
    image_url: '',
    isActive: true
  };
  confirmPassword = '';
  passwordMatch = false;
  passwordValid = false;
  strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

  checkPasswordMatch() {
    this.passwordMatch = this.user.password === this.confirmPassword;
  }

  checkPasswordStrength() {
    this.passwordValid = this.strongPasswordRegex.test(this.user.password);
  }

  onSubmit() {
    if (this.passwordMatch && this.passwordValid) {
      this._userService.register(this.user.username, this.user.email, this.user.password).subscribe(
        response => {
          const responseData: Rep = JSON.parse(response);
          if (responseData.message === 'User added successfully' && responseData.token) {
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
        }
      );
    }
  }
}
