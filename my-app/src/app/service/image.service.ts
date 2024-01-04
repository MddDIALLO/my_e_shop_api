import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private API_URL = environment.API_URL;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }), responseType: 'text' as 'json'
  }

  constructor(
    private http: HttpClient
  ) {}

  uploadImage(imageData: string, uploadPath: string, fileName: string) {
    return this.http.post<any>(
      `${this.API_URL}/api/images`,
      { imageData, uploadPath, fileName },
      this.options
    );
  }
}
