import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'angular-credit-cards';
import { Cart, Item, Product } from '../../models/product.interface';
import { CartService } from '../../service/cart.service';
import { RefreshService } from '../../service/refresh.service';
import { Message, Rep, UpdateDelRes } from '../../models/response.interface';
import { Order_Item } from '../../models/order.interface';
import { OrderService } from '../../service/order.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: Cart = {
    items: []
  };
  private API_URL = environment.API_URL;
  staticUrl: string = `${this.API_URL}/static/`;
  deliveryDate: { [id: number]: string } = {};
  shipping: { [id: number]: number } = {};
  totalShiping: number = 0;
  totalCartItems: number = 0;
  totalCartCost: number = 0;
  totalCartCostTx: number = 0;
  deliveryDate1: string = '';
  deliveryDate2: string = '';
  deliveryDate3: string = '';
  isEditingQuantity: { [id: number]: boolean } = {};
  selectedItem: { [id: number]: Item } = {};
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  }
  placingOrder: boolean = false;
  creditCard: any = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };
  creditCardNumberRegex = /^(\d{4})\s?(\d{4})\s?(\d{4})\s?(\d{4})$/;
  validCN: boolean = false;
  creditCardExpireRegex = /^(0[1-9]|1[0-2])\/(20[2-9][0-9]|2[1-9][0-9]{2})$/;
  validCEXP: boolean = false;
  creditCardCvvRegex = /^\d{3,4}$/;
  validCVV: boolean = false;
  isConfirming: boolean = false;
  reqIssue: boolean = false;
  reqIssueMessage: string = '';
  reqSuccess: boolean = false;
  reqSuccessMessage: string = '';

  constructor(
    private _cartService: CartService,
    private router: Router,
    private _refreshService: RefreshService,
    private _orderService: OrderService
  ) {
    this.getCart();
    this._refreshService.triggerRefresh();
    this.setDefaultValues();
    this.getConnectedUser();

    // if(localStorage.getItem('cart')) {
    //   localStorage.removeItem('cart');
    // }
  }

  getConnectedUser() {
    const tokenData: string | null = localStorage.getItem('token');
    let role: string = '';

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      role = parsedTokenData.connectedUser.role;
      this.connectedUser = parsedTokenData.connectedUser;
    }
  }

  getCart() {
    const cart: Cart = this._cartService.getCart();

    if(cart){
      this.cart = cart;
      this.getTotalCartItemsAndCosts();
      this.getTotalCartShiping();
    }
  }

  getCartItems(): Item[] | null {
    const cart: Cart = this._cartService.getCart();

    if(cart){
      const cartItems: Item[] = cart.items;

      return cartItems;
    }

    return null;
  }

  removeFromCart(product: Product) {
    this.cart.items = this.cart.items.filter(cartItem => cartItem.product.id !== product.id);

    if(this.cart.items.length > 0) {
      this.saveToStorage();
    } else {
      if(localStorage.getItem('cart')) {
        localStorage.removeItem('cart');
      }
    }
  }

  showEditItemQuantityForm(productId: number) {

    this.selectedItem[productId] = this.cart.items.find(item => item.product.id === productId) || {
      product: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        made_date: new Date,
        expiry_date: new Date,
        image_url: ''
      },
      quantity: 0,
      deliveryDate: '',
      shipping: 0
    };
    this.isEditingQuantity[productId] = true;
  }

  hideEditItemQuantity(productId: number) {
    this.isEditingQuantity[productId] = false;
  }

  updateCartItemQuantity(productId: number, quantity: number) {
    const itemToUpdate = this.cart.items.find(item => item.product.id === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      this.saveToStorage();

      console.log('Updated');
    } else {
      console.log('Product not found in the cart.');
    }
    this.hideEditItemQuantity(productId);
  }

  updateCartItem(cartItem: Item) {
    let itemToUpdate = this.cart.items.find(item => item.product.id === cartItem.product.id);

    if (itemToUpdate) {
      itemToUpdate = cartItem;
      this.saveToStorage();

      console.log('Updated');
    } else {
      console.log('Product not found in the cart.');
    }

    if(this.isEditingQuantity[cartItem.product.id] === true) {
      this.hideEditItemQuantity(cartItem.product.id);
    }
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.getTotalCartShiping();
    this.getTotalCartItemsAndCosts();
  }


  formatCurrency(priceCents: number) {
    return ((priceCents * 100) / 100).toFixed(2);
  }

  addDays(days: number) {
    const date: Date = new Date();
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  setDeliveryDate(id: number, days: number, cost: number) {
    this.selectedItem[id] = this.cart.items.find(item => item.product.id === id) || {
      product: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        made_date: new Date,
        expiry_date: new Date,
        image_url: ''
      },
      quantity: 0,
      deliveryDate: '',
      shipping: 0
    };

    if(this.selectedItem[id].product.id > 0) {
      this.selectedItem[id].deliveryDate = this.addDays(Number(days)).toDateString();
      this.selectedItem[id].shipping = Number(cost);
      this.updateCartItem(this.selectedItem[id]);
      this.getTotalCartShiping();
    }
    // this.deliveryDate[Number(id)] = this.addDays(Number(days)).toDateString();
    // this.shipping[Number(id)] = Number(cost);
  }

  setDefaultValues() {
    if(this.cart.items.length > 0) {
      this.cart.items.forEach((cartItem) => {
        if(cartItem.deliveryDate.length === 0) {
          cartItem.deliveryDate = this.deliveryDate3;
        }
        // this.selectedItem[cartItem.product.id] = cartItem
      });
    }

    this.deliveryDate1 = this.addDays(1).toDateString();
    this.deliveryDate2 = this.addDays(3).toDateString();
    this.deliveryDate3 = this.addDays(7).toDateString();
  }

  getTotalCartItemsAndCosts() {
    if(this.cart.items.length > 0) {
      this.totalCartItems = this.cart.items.length;

      this.totalCartCost = 0;
      this.totalCartCostTx = 0;
      this.cart.items.forEach((cartItem) => {
        this.totalCartCost += cartItem.quantity * cartItem.product.price;
      });
      this.totalCartCostTx = (this.totalCartCost + this.totalShiping) * 1.1;
    }
  }

  getTotalCartShiping() {
    if(this.cart.items.length > 0) {
      this.totalShiping = 0;
      this.cart.items.forEach((item) => {
        this.totalShiping += item.shipping;
      })
    }
  }

  showPlacingOrderForm() {
    if(this.cart.items.length > 0) {
      if(this.connectedUser.id > 0) {
        this.placingOrder = true;
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.reqIssue = true;
      this.reqIssueMessage = 'Empty Cart'
    }
  }

  hidePlacingOrderForm() {
    this.placingOrder = false;
  }

  createOrder(user_id?: number) {
    let newOrderItems: Order_Item[] = [];

    for (const item of this.cart.items) {
      newOrderItems.push(
        {
          product_id: item.product.id,
          quantity: item.quantity,
          deliveryDate: item.deliveryDate,
          shipping: item.shipping
        }
        );
    }

    if(newOrderItems.length > 0) {
      this._orderService.addNewOrder({ user_id, items:newOrderItems }).subscribe(
        (response) => {
          const responseData: any = response;
          const data: UpdateDelRes = JSON.parse(responseData);
          if(data.message === 'New order created') {
            this.reqSuccess = true;
            this.reqSuccessMessage = data.message;
            localStorage.removeItem('cart');
            this.getCart();
          }
        },
        (error) => {
          const errorData: any = error;
          const message: Message = JSON.parse(errorData);
          this.reqIssue = true;
          this.reqIssueMessage = message.message;
        }
      );
    } else {
      this.reqIssue = true;
      this.reqIssueMessage = 'Invalid cart';
    }

    setTimeout(() => {
      if(this.reqSuccess) {
        this.reqSuccess = false;
        this.router.navigate(['/order']);
      }
      if(this.reqIssue) {
        this.reqIssue = false;
      }

      this.hidePlacingOrderForm();
    }, 2000);
  }

  checkCardNumber() {
    this.validCN = this.creditCardNumberRegex.test(this.creditCard.cardNumber);
  }

  checkExpiry() {
    this.validCEXP = this.creditCardExpireRegex.test(this.creditCard.expiryDate);
  }

  checkCvv() {
    this.validCVV = this.creditCardCvvRegex.test(this.creditCard.cvv);
  }

  formatCardNumber() {
    this.checkCardNumber();
    const sanitizedInput = this.creditCard.cardNumber.replace(/\D/g, '');
    const formattedInput = sanitizedInput.replace(/(\d{4})/g, '$1 ');
    this.creditCard.cardNumber = formattedInput.trim();
  }

  submitCreditCardForm() {
    if(this.validCN && this.validCEXP && this.validCVV) {
      this.createOrder(this.connectedUser.id);
    }
  }
}
