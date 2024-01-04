import { Component } from '@angular/core';
import { User, UserTable, UsersData } from '../../../models/user.interface';
import { UserService } from '../../../service/user/user.service';
import { UpdateDelRes } from '../../../models/response.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: UserTable[] = [];
  isEditingUser: boolean = false;
  newPassword = '';
  reqIssue = false;
  reqIssueMessage = '';
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

  constructor(private _userService: UserService) {
    this.fetchUsers();
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

  editUser() {
    if(this.selectedUser.id > 0) {
      this._userService.updateUser(
        this.selectedUser.id,
        {
          password: this.newPassword,
          role: this.selectedUser.image_url,
          isActive: this.selectedUser.isActive
        }
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'User updated successfully') {
              this.isEditingUser = false;
              this.fetchUsers();
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

  exportToExcel() {

  }

  addNewUser() {

  }

  deleteUser(userId: number) {
    this._userService.deleteUser(userId).subscribe(() => {
      this.fetchUsers();
    });
  }

  cancelEditUser() {
    this.isEditingUser = false;
  }
}
