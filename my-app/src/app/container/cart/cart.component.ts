import { Component } from '@angular/core';
import { Cart, Item, Product } from '../../models/product.interface';
import { CartService } from '../../service/cart.service';

@Component({
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: Cart = {
    items: []
  };
  staticUrl: string = 'http://localhost:3000/static/';

  constructor(
    private _cartService: CartService
  ) {
    this.getCart();
    console.log(this.cart);
  }

  getCart() {
    const cart: Cart = this._cartService.getCart();

    if(cart){
      this.cart = cart;
    }
  }

  removeFromCart(product: Product) {
    this.cart.items = this.cart.items.filter(cartItem => cartItem.product.id !== product.id);
    this.saveToStorage();

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
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }


  formatCurrency(priceCents: number) {
    return ((priceCents * 100) / 100).toFixed(2);
  }

  nowDate = new Date();

  addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  deliveryDate1 = this.addDays(this.nowDate, 1).toDateString();
  deliveryDate2 = this.addDays(this.nowDate, 3).toDateString();
  deliveryDate3 = this.addDays(this.nowDate, 7).toDateString();
}
