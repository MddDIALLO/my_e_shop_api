import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order_Item } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_URL = environment.API_URL;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }), responseType: 'text' as 'json'
  }

  constructor(private http: HttpClient) {}

  addNewOrder(options:
    {
      user_id?: number,
      items?: Order_Item[]
    }): Observable<any> {
    const newOrder: any = {};

    if (options.user_id !== undefined && options.user_id !== null) {
      newOrder.user_id = options.user_id;
    }
    if (options.items !== undefined && options.items.length > 0) {
      newOrder.items = options.items;
    }

    return this.http.post<any>(`${this.API_URL}/api/orders`, newOrder, this.options);
  }

  updateOrder(orderId:number,
    options: {
      status?: string
    }): Observable<any> {
    const newOrder: any = {};

    if (options.status !== undefined && options.status !== null) {
      newOrder.status = options.status;
    }

    return this.http.put<any>(`${this.API_URL}/api/orders/${orderId}`, newOrder, this.options);
  }

  getOrders() {
    return this.http.get(`${this.API_URL}/api/orders`, this.options);
  }

  getOrderById(orderId: number) {
    return this.http.get(`${this.API_URL}/api/orders/${orderId}`, this.options);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/api/orders/cancel/${orderId}`, this.options);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/api/orders/${orderId}`, this.options);
  }
}
