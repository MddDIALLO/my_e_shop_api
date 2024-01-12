import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Item, Product } from '../../models/product.interface';
import { CartService } from '../../service/cart.service';
import { RefreshService } from '../../service/refresh.service';
import { ValidateTokenService } from '../../service/user/validate-token.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: Cart = {
    items: []
  };
  staticUrl: string = 'http://localhost:3000/static/';
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

  constructor(
    private _cartService: CartService,
    private router: Router,
    private _refreshService: RefreshService
  ) {
    this.getCart();
    this._refreshService.triggerRefresh();
    // this.setDefaultIsEdit();
    // this.setDeliveryDates();
    this.setDefaultValues();

    // if(localStorage.getItem('cart')) {
    //   localStorage.removeItem('cart');
    // }
  }

  getCart() {
    const cart: Cart = this._cartService.getCart();

    if(cart){
      this.cart = cart;
      this.getTotalCartItemsAndCosts();
      this.getTotalCartShiping();
    }
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

  // setDefaultIsEdit() {
  //   if(this.cart.items.length > 0) {
  //     this.cart.items.forEach((cartItem) => {
  //       this.isEditingQuantity[cartItem.product.id] = false;
  //     });
  //   }
  // }

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
}
