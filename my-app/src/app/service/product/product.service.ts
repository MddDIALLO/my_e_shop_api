import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = environment.API_URL;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }), responseType: 'text' as 'json'
  }

  constructor(private http: HttpClient) {}

  addNewProduct(options:
    {
      name?: string,
      description?: string,
      price?: number,
      image_url?: string
    }): Observable<any> {
    const newProduct: any = {};

    if (options.name !== undefined && options.name !== null) {
      newProduct.name = options.name;
    }
    if (options.description !== undefined && options.description !== null) {
      newProduct.description = options.description;
    }
    if (options.price !== undefined && options.price !== null) {
      newProduct.price = options.price;
    }
    if (options.image_url !== undefined && options.image_url !== null) {
      newProduct.image_url = options.image_url;
    }

    return this.http.post<any>(`${this.API_URL}/api/products`, newProduct, this.options);
  }

  updateProduct(productId:number,
    options: {
      name?: string,
      description?: string,
      price?: number,
      image_url?: string
    }): Observable<any> {
    const newProduct: any = {};

    if (options.name !== undefined && options.name !== null) {
      newProduct.name = options.name;
    }
    if (options.description !== undefined && options.description !== null) {
      newProduct.description = options.description;
    }
    if (options.price !== undefined && options.price !== null) {
      newProduct.price = options.price;
    }
    if (options.image_url !== undefined && options.image_url !== null) {
      newProduct.image_url = options.image_url;
    }

    return this.http.put<any>(`${this.API_URL}/api/products/${productId}`, newProduct, this.options);
  }

  getProducts() {
    return this.http.get(`${this.API_URL}/api/products`, this.options);
  }

  getProductById(id: number) {
    return this.http.get(`${this.API_URL}/api/products/${id}`, this.options);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/api/products/${id}`, this.options);
  }
}
