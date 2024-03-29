import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateTokenService } from '../../service/user/validate-token.service';
import { RefreshService } from '../../service/refresh.service';
import { Rep } from '../../models/response.interface';
import { Cart } from '../../models/product.interface';
import { CartService } from '../../service/cart.service';
import { SharedScrollService } from '../../service/shared-scroll.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private API_URL = environment.API_URL;
  staticUrl: string = `${this.API_URL}/static/`;
  tokenStatus: string = '';
  userRole: string = '';
  connectedUser: any = {
    id: 0,
    username: '',
    email: '',
    role: '',
    image_url: ''
  }
  isFixed = false;

  constructor(
    private validateToken: ValidateTokenService,
    private router: Router,
    private cartService: CartService,
    private refreshService: RefreshService,
    private sharedScrollService: SharedScrollService
  ) {}

  ngOnInit(): void {
    this.checkTokenValidity();
    this.checkRole();
    this.refreshService.refresh.subscribe(() => {
      this.checkTokenValidity();
      this.checkRole();
    });

    this.sharedScrollService.getScrollObservable().subscribe((scrolling) => {
      this.isFixed = scrolling;
    });
  }

  getCart(): Cart | null {
    const cart = this.cartService.getCart();
    if(cart) {
      return cart;
    }

    return null;
  }

  getCartQuantity(): number {
    let cartQuantity: number = 0;
    const cart = this.getCart();

    if(cart) {
      cart.items.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
    }

    return cartQuantity;
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
