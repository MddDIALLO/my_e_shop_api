import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshService } from '../../service/refresh.service';
import { OrderService } from '../../service/order.service';
import { Got_Order, Order_Res } from '../../models/order.interface';
import { Rep } from '../../models/response.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orders: Got_Order[] = [];
  userOrders: Got_Order[] = [];
  private API_URL = environment.API_URL;
  staticUrl: string = `${this.API_URL}/static/`;
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  }

  constructor(
    private router: Router,
    private _refreshService: RefreshService,
    private _orderService: OrderService
  ) {
    this._refreshService.triggerRefresh();
    this.getConnectedUser();
    this.fetchOrders();
  }

  getConnectedUser() {
    const tokenData: string | null = localStorage.getItem('token');

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      this.connectedUser = parsedTokenData.connectedUser;
    }
  }

  fetchOrders() {
    this._orderService.getOrders().subscribe(data => {
      let ordersData: any = data;
      const responseData: Order_Res = JSON.parse(ordersData);
      const results: Got_Order[] = responseData.result;

      if(results) {
        this.orders = results;
        this.userOrders = this.orders.filter(orderItem => orderItem.user_id === this.connectedUser.id);
      }
    });
  }
}
