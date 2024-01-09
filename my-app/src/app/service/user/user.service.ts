import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.interface';
import { Rep } from '../../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }), responseType: 'text' as 'json'
  }

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/users`, {username, email, password}, this.options);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/users/login`, {email, password}, this.options);
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/api/users/logout`, { token: token }, this.options);
  }

  getUsers() {
    return this.http.get(`${this.API_URL}/api/users`, this.options);
  }

  getUserById(id: number) {
    return this.http.get(`${this.API_URL}/api/users/${id}`, this.options);
  }

  updateUser(id: number, options: { username?: string, email?: string, password?: string, role?: string, image_url?: string, isActive?: number }): Observable<any> {
    const updatedUser: any = {};

    if (options.username !== undefined && options.username !== null) {
      updatedUser.username = options.username;
    }
    if (options.email !== undefined && options.email !== null) {
      updatedUser.email = options.email;
    }
    if (options.password !== undefined && options.password !== null) {
      updatedUser.password = options.password;
    }
    if (options.role !== undefined && options.role !== null) {
      updatedUser.role = options.role;
    }
    if (options.image_url !== undefined && options.image_url !== null) {
      updatedUser.image_url = options.image_url;
    }
    if (options.isActive !== undefined && options.isActive !== null) {
      updatedUser.isActive = options.isActive;
    }

    return this.http.put<any>(`${this.API_URL}/api/users/${id}`, updatedUser, this.options);
  }

  updateConnectedUser(image_url: string) {
    const tokenData: string | null = localStorage.getItem('token');

    if (tokenData) {
      let parsedTokenData: Rep = JSON.parse(tokenData);

      parsedTokenData.connectedUser.image_url = image_url;

      if(localStorage.getItem('token')) {
        localStorage.removeItem('token');
      }

      localStorage.setItem('token', JSON.stringify(parsedTokenData));
    }
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/api/users/${id}`, this.options);
  }
}
