import { Component } from '@angular/core';
import { UserTable, UsersData } from '../../../models/user.interface';
import { UserService } from '../../../service/user/user.service';
import { Message, UpdateDelRes } from '../../../models/response.interface';
import { HttpClient, HttpResponse  } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: UserTable[] = [];
  isEditingUser: boolean = false;
  isConfirming: boolean = false;
  newPassword = '';
  passwordValid = false;
  strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  reqIssue = false;
  reqIssueMessage = '';
  reqSuccess = false;
  reqSuccessMessage = '';
  selectedUser: UserTable = {
    id: 0,
    username: '',
    email: '',
    role: '',
    created_date: null,
    updated_date: null,
    image_url: '',
    isActive: false
  };
  userToDelete: UserTable = {
    id: 0,
    username: '',
    email: '',
    role: '',
    created_date: null,
    updated_date: null,
    image_url: '',
    isActive: false
  };
  staticUrl: string = 'http://localhost:3000/static/';
  imageUrl: string | undefined;

  constructor(
    private _userService: UserService,
    private http: HttpClient
  ) {
    this.fetchUsers();
  }

  async imageUrlExists(imageUrl: string): Promise<boolean> {
    try {
      const response = await this.http.head(imageUrl).toPromise();
      if (response instanceof HttpResponse) {
        return response.status === 200;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  getCurrentTime(): number {
    return Date.now();
  }

  fetchUsers() {
    this._userService.getUsers().subscribe(data => {
      let usersData: any = data;
      const responseData: UsersData = JSON.parse(usersData);
      const results: UserTable[] = responseData.result;

      if(results) {
        this.users = results;
      }
    });
  }

  exportToExcel() {

  }

  exportPageToExcel() {

  }

  checkPasswordStrength() {
    this.passwordValid = this.strongPasswordRegex.test(this.newPassword);
  }

  showEditUserForm(userId: number) {
    this.selectedUser = this.users.find(user => user.id === userId) || {
      id: 0,
      username: '',
      email: '',
      role: '',
      created_date: null,
      updated_date: null,
      image_url: '',
      isActive: false
    };
    this.isEditingUser = true;
  }

  cancelEditUser() {
    this.isEditingUser = false;
  }

  editUser() {
    if(this.selectedUser.id > 0) {
      this._userService.updateUser(
        this.selectedUser.id,
        {
          password: this.newPassword,
          role: this.selectedUser.role
        }
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'User updated successfully') {
              this.fetchUsers();
              this.reqSuccess = true;
              this.reqSuccessMessage = data.message;

              setTimeout(() => {
                this.reqIssue = false;
                this.isEditingUser = false;
              }, 3000);
            }
          },
          (error) => {
            const errorData: any = error;
            const message: Message = JSON.parse(errorData);
            this.reqIssue = true;
            this.reqIssueMessage = message.message;

            setTimeout(() => {
              this.reqIssue = false;
              this.isEditingUser = false;
            }, 3000);
          }
        )
    }
  }

  blockUser(userId: number, option: string) {
    if(userId > 0 && option) {
      this._userService.updateUser(
        userId,
        {
          isActive: parseInt(option, 10)
        }
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'User updated successfully') {
              this.fetchUsers();
              this.reqSuccess = true;
              this.reqSuccessMessage = data.message;

              setTimeout(() => {
                this.reqSuccess = false;
                this.isEditingUser = false;
              }, 3000);
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

  showConfirming(userId: number) {
    this.userToDelete = this.users.find(user => user.id === userId) || {
      id: 0,
      username: '',
      email: '',
      role: '',
      created_date: null,
      updated_date: null,
      image_url: '',
      isActive: false
    };
    this.isConfirming = true;
  }

  hideConfirming() {
    this.isConfirming = false;
  }

  deleteUser(userId: number) {
    this._userService.deleteUser(userId).subscribe(
      (response) => {
        const responseData: any = response;
        const data: UpdateDelRes = JSON.parse(responseData);
        if(data.message === 'User deleted successfully') {
          this.fetchUsers();
          this.reqSuccess = true;
          this.reqSuccessMessage = data.message;

          setTimeout(() => {
            this.reqSuccess = false;
            this.isConfirming = false;
          }, 3000);
        }
      },
      (error) => {
        const errorData: any = error;
        const message: Message = JSON.parse(errorData);
        this.reqIssue = true;
        this.reqIssueMessage = message.message;

        setTimeout(() => {
          this.reqIssue = false;
          this.isConfirming = false;
        }, 3000);
      }
    );
  }

  // Pagination logic
  currentPage: number = 1;
  usersPerPage: number = 4;

  getUsersForCurrentPage(): UserTable[] {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  getPageNumbers(): number[] {
    return new Array(this.getTotalPages()).fill(0).map((x, i) => i + 1);
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
