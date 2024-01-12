import { Component } from '@angular/core';
import { ValidateTokenService } from '../../service/user/validate-token.service';
import { RefreshService } from '../../service/refresh.service';
import { Product, productsData, Cart, Item } from '../../models/product.interface';
import { ProductService } from '../../service/product/product.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tokenStatus: string = '';
  products: Product[] = [];
  quantityOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedQuantity: number = 1;
  selectedQuantities: { [id: number]: number } = {};
  reqIssue: { [id: number]: boolean } = {};
  reqIssueMessage: { [id: number]: string } = {};
  reqSuccess: { [id: number]: boolean } = {};
  reqSuccessMessage: { [id: number]: string } = {};
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    made_date: new Date,
    expiry_date: new Date,
    image_url: ''
  };
  staticUrl: string = 'http://localhost:3000/static/';
  deliveryDate: string = '';

  constructor(
    private validateToken: ValidateTokenService,
    private refreshService: RefreshService,
    private _productService: ProductService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkTokenValidity();
    this.refreshService.triggerRefresh();
    this.refreshService.refresh.subscribe(() => {
      this.checkTokenValidity();
    });
    this.fetchProducts();
    this.setDeliveryDates();

    // if(localStorage.getItem('token')) {
    //   localStorage.removeItem('token');
    // }
  }

  checkTokenValidity() {
    if (this.validateToken.checkTokenValidity()) {
      this.tokenStatus = 'Valid token';
    } else {
      this.tokenStatus = 'Invalid token';
    }
  }

  getCurrentTime(): number {
    return Date.now();
  }

  fetchProducts() {
    this._productService.getProducts().subscribe(data => {
      let usersData: any = data;
      const responseData: productsData = JSON.parse(usersData);
      const results: Product[] = responseData.result;

      if(results) {
        this.products = results;
      }
    });
  }

  isLogedIn(): boolean {
    return this.tokenStatus === 'Valid token';
  }

  addToCart(product: Product) {
    const newCartItem: Item = {
      product: product,
      quantity: Number(this.selectedQuantities[product.id]),
      deliveryDate: this.deliveryDate,
      shipping: 0
    };

    if(newCartItem.quantity > 0) {
      this._cartService.addToCart(newCartItem);
      this.reqSuccess[product.id] = true;
      this.reqIssue[product.id] = false;
      this.reqSuccessMessage[product.id] = 'Added to cart';
    } else {
      this.reqSuccess[product.id] = false;
      this.reqIssue[product.id] = true;
      this.reqIssueMessage[product.id] = 'Select product quantity';
    }

    setTimeout(() => {
      if(this.reqSuccess[product.id]) {
        this.reqSuccess[product.id] = false;
      }
      if(this.reqIssue[product.id]) {
        this.reqIssue[product.id] = false;
      }
    }, 2000);
  }

  addDays(days: number) {
    const date: Date = new Date();
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  setDeliveryDates() {
    this.deliveryDate = this.addDays(7).toDateString();
  }

  // Pagination logic
  currentPage: number = 1;
  productsPerPage: number = 25;

  getProductsForCurrentPage(): Product[] {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  getPageNumbers(): number[] {
    return new Array(this.getTotalPages()).fill(0).map((x, i) => i + 1);
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
