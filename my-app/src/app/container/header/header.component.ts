import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateTokenService } from '../../service/user/validate-token.service';
import { RefreshService } from '../../service/refresh.service';
import { Rep } from '../../models/response.interface';
import { Cart } from '../../models/product.interface';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  tokenStatus: string = '';
  userRole: string = '';
  staticUrl: string = 'http://localhost:3000/static/';
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  }
  cart: Cart = {
    items : []
  };
  cartQuantity: number = 0;

  constructor(
    private validateToken: ValidateTokenService,
    private router: Router,
    private cartService: CartService,
    private refreshService: RefreshService
  ) {
    this.updateCart();
    this.updateCartQuantity();
  }

  ngOnInit(): void {
    this.checkTokenValidity();
    this.checkRole();
    this.refreshService.refresh.subscribe(() => {
      this.checkTokenValidity();
      this.checkRole();
    });
  }

  updateCart() {
    this.cart = this.cartService.getCart();
  }

  updateCartQuantity() {
    this.cartQuantity = 0;

    this.cart.items.forEach((cartItem) => {
      this.cartQuantity += cartItem.quantity;
    });
  }

  getCurrentTime(): number {
    return Date.now();
  }

  imageUrlWithTimestamp: string | null = null;

  updateImageUrl() {
    if (this.connectedUser.image_url.length > 0) {
      const timestamp = Date.now();
      this.imageUrlWithTimestamp = `${this.staticUrl}images/users/${this.connectedUser.image_url}?${timestamp}`;
    }
  }

  checkRole() {
    const tokenData: string | null = localStorage.getItem('token');
    let role: string = '';

    if (tokenData) {
      const parsedTokenData: Rep = JSON.parse(tokenData);
      role = parsedTokenData.connectedUser.role;
      this.connectedUser = parsedTokenData.connectedUser;

      if(role === 'ADMIN') {
        this.userRole = 'ADMIN'
      }
    }
  }

  checkTokenValidity() {
    if (this.validateToken.checkTokenValidity()) {
      this.tokenStatus = 'Valid token';
    } else {
      this.tokenStatus = 'Invalid token';
    }
  }

  isHomePage(): boolean {
    return this.router.url === '/home';
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  isAdminPage(): boolean {
    return this.router.url === '/admin';
  }

  isProfilePage(): boolean {
    return this.router.url === '/profile';
  }

  isLogedIn(): boolean {
    return this.tokenStatus === 'Valid token';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
}
