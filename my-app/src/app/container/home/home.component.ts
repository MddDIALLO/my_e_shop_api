import { Component } from '@angular/core';
import { ValidateTokenService } from '../../service/user/validate-token.service';
import { RefreshService } from '../../service/refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tokenStatus: string = '';
  products = [
    {
      id: 1,
      name: 'Product 1',
      price: '$19.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Product 2',
      price: '$24.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Product 3',
      price: '$29.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 4,
      name: 'Product 4',
      price: '$24.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 5,
      name: 'Product 5',
      price: '$29.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 6,
      name: 'Product 6',
      price: '$24.99',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 7,
      name: 'Product 7',
      price: '$29.99',
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];

  constructor(
    private validateToken: ValidateTokenService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.checkTokenValidity();
    this.refreshService.triggerRefresh();
    this.refreshService.refresh.subscribe(() => {
      this.checkTokenValidity();
    });
  }

  checkTokenValidity() {
    if (this.validateToken.checkTokenValidity()) {
      this.tokenStatus = 'Valid token';
    } else {
      this.tokenStatus = 'Invalid token';
    }
  }

  isLogedIn(): boolean {
    return this.tokenStatus === 'Valid token';
  }
}
