import { Component } from '@angular/core';
import { Rep, UpdateDelRes, ImageRes } from '../../models/response.interface';
import { Router } from '@angular/router';
import { RefreshService } from '../../service/refresh.service';
import { UserService } from '../../service/user/user.service';
import { User } from '../../models/user.interface';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  confirmPassword = '';
  passwordMatch = false;
  passwordValid = false;
  passwordOk = (this.passwordValid && this.passwordMatch);
  imageSaved = false;
  userUpdated = false;
  updateUserMessage = '';
  strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  reqIssue = false;
  reqIssueMessage = '';
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  };
  user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    role: '',
    image_url: '',
    isActive: false
  };
  staticUrl: string = 'http://localhost:3000/static/';

  constructor(
    private _userService: UserService,
    private router: Router,
    private refreshService: RefreshService,
    private _imagesService: ImageService
  ) {}

  ngOnInit(): void {
    this.getConnectedUser();
    this.refreshService.triggerRefresh();
  }

  imageUrlWithTimestamp: string | null = null;

  updateImageUrl() {
    if (this.connectedUser.image_url.length > 0) {
      const timestamp = Date.now();
      this.imageUrlWithTimestamp = `${this.staticUrl}images/users/${this.connectedUser.image_url}?${timestamp}`;
    }
  }

  getConnectedUser() {
    const tokenData: string | null = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      this.connectedUser = parsedTokenData.connectedUser;
      this.user.id = this.connectedUser.id;
      this.user.role = this.connectedUser.role;
      this.user.isActive = this.connectedUser.isActive;
    }
  }

  checkPasswordMatch() {
    this.passwordMatch = this.user.password === this.confirmPassword;
  }

  checkPasswordStrength() {
    this.passwordValid = this.strongPasswordRegex.test(this.user.password);
  }

  getFileExtension(fileName: string): string {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        const uploadPath = 'images/users/';
        const fileExtension = this.getFileExtension(file.name);
        const fileName = `user_${this.connectedUser.id}.${fileExtension}`;

        this._imagesService.uploadImage(imageData, uploadPath, fileName).subscribe(
          (response) => {
            console.log(response);
            const responseData: any = response;
            const data: ImageRes = JSON.parse(responseData);
            if(data.message === 'Image saved successfully') {
              this.imageSaved = true;
              this.connectedUser.image_url = fileName;
              this.user.image_url = fileName;
              this._userService.updateConnectedUser(fileName);
              this.refreshService.triggerRefresh();
            }
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if(this.user.id > 0) {
      this._userService.updateUser(
        this.user.id,
        {
          password: this.user.password,
          image_url: this.user.image_url
        }
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'User updated successfully') {
              this.updateUserMessage = data.message;
              this.userUpdated = true;
              this.user.password = '';
              this.confirmPassword = '';
              this.user.image_url = '';
              this.imageSaved = false;
              this.passwordOk = false;
              this.refreshService.triggerRefresh();
            }
          },
          (error) => {
            this.reqIssue = true;
            this.reqIssueMessage = error.error.message;
            console.log(error);
          }
        )
    }
  }
}
