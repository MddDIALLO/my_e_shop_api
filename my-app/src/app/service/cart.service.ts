import { Injectable } from '@angular/core';
import { Cart, Item, Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Cart = {
    items: []
  };

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(newCartItem: Item): string {
    const existingItem = this.cart.items.find(item => item.product.id === newCartItem.product.id);

    if (existingItem) {
      existingItem.quantity += Number(newCartItem.quantity);
    } else {
      this.cart.items.push(newCartItem);
    }

    this.saveToStorage();

    return 'Added';
  }

  updateCartItemQuantity(productId: number, quantity: number): string {
    const itemToUpdate = this.cart.items.find(item => item.product.id === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      this.saveToStorage();

      return 'Updated';
    } else {
      return 'Product not found in the cart.';
    }
  }

  removeFromCart(product: Product): string {
    this.cart.items = this.cart.items.filter(cartItem => cartItem.product.id !== product.id);
    this.saveToStorage();

    return 'Removed';
  }

  getCart(): Cart {
    return this.cart;
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        this.cart = JSON.parse(storedCart);
      } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
        this.clearCart();
      }
    }
  }

  private clearCart() {
    this.cart = { items: [] };
    localStorage.removeItem('cart');
  }
}
