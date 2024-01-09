import { Component } from '@angular/core';
import { Product, productsData } from '../../../models/product.interface';
import { ProductService } from '../../../service/product/product.service';
import { HttpClient } from '@angular/common/http';
import { ImageRes, Message, UpdateDelRes } from '../../../models/response.interface';
import { ImageService } from '../../../service/image.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = [];
  validMadeDate: boolean = false;
  validExpiryDate: boolean = false;
  isEditingProduct: boolean = false;
  isAddingProduct: boolean = false;
  isConfirming: boolean = false;
  imageSaved = false;
  reqIssue = false;
  reqIssueMessage = '';
  reqSuccess = false;
  reqSuccessMessage = '';
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    made_date: new Date,
    expiry_date: new Date,
    image_url: ''
  };
  selectedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    made_date: new Date('2024-01-01'),
    expiry_date: new Date('2024-12-31'),
    image_url: ''
  };
  productToDelete: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    made_date: new Date,
    expiry_date: new Date,
    image_url: ''
  };
  staticUrl: string = 'http://localhost:3000/static/';

  constructor(
    private _productService: ProductService,
    private _imagesService: ImageService,
    private http: HttpClient
  ) {
    this.fetchProducts();
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

  showAddingProductForm() {
    this.isAddingProduct = true;
  }

  hideAddingProductForm() {
    this.isAddingProduct = false;
  }

  addProduct() {
    if(this.newProduct.id === 0 && this.newProduct.name.length > 0) {
      this._productService.addNewProduct(
        {
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: this.newProduct.price,
          made_date: this.newProduct.made_date,
          expiry_date: this.newProduct.expiry_date,
          image_url: this.newProduct.image_url
        }
        ).subscribe(
          (response) => {
            console.log(response);
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'Product added successfully') {
              this.fetchProducts();
              this.reqSuccess = true;
              this.reqSuccessMessage = data.message;

              setTimeout(() => {
                this.reqSuccess = false;
                this.isAddingProduct = false;
              }, 2000);
            }
          },
          (error) => {
            console.log(error);
            const errorData: any = error;
            const message: Message = JSON.parse(errorData);
            this.reqIssue = true;
            this.reqIssueMessage = message.message;

            setTimeout(() => {
              this.reqIssue = false;
              this.isAddingProduct = false;
            }, 2000);
          }
        )
    }
  }

  showEditProductForm(productId: number) {
    this.selectedProduct = this.products.find(produt => produt.id === productId) || {
      id: 0,
      name: '',
      description: '',
      price: 0,
      made_date: new Date,
      expiry_date: new Date,
      image_url: ''
    };
    this.isEditingProduct = true;
  }

  cancelEditProduct() {
    this.isEditingProduct = false;
  }

  getFileExtension(fileName: string): string {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  onImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        const uploadPath = 'images/products/';
        const fileExtension = this.getFileExtension(file.name);
        const fileName = `product_${this.selectedProduct.id}.${fileExtension}`;

        this._imagesService.uploadImage(imageData, uploadPath, fileName).subscribe(
          (response) => {
            console.log(response);
            const responseData: any = response;
            const data: ImageRes = JSON.parse(responseData);
            if(data.message === 'Image saved successfully') {
              this.imageSaved = true;
              this.selectedProduct.image_url = fileName;
              console.log('ProductiImage saved successfully');
            }
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  editProduct() {
    if(this.selectedProduct.id > 0) {
      this._productService.updateProduct(
        this.selectedProduct.id,
        {
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          price: this.selectedProduct.price,
          made_date: this.selectedProduct.made_date,
          expiry_date: this.selectedProduct.expiry_date,
          image_url: this.selectedProduct.image_url
        }
        ).subscribe(
          (response) => {
            const responseData: any = response;
            const data: UpdateDelRes = JSON.parse(responseData);
            if(data.message === 'Product updated successfully') {
              this.fetchProducts();
              this.reqSuccess = true;
              this.reqSuccessMessage = data.message;

              setTimeout(() => {
                this.reqSuccess = false;
                this.isEditingProduct = false;
              }, 1000);
            }
          },
          (error) => {
            const errorData: any = error;
            const message: Message = JSON.parse(errorData);
            this.reqIssue = true;
            this.reqIssueMessage = message.message;

            setTimeout(() => {
              this.reqIssue = false;
              this.isEditingProduct = false;
            }, 1000);
          }
        )
    }
  }

  showConfirming(productId: number) {
    this.productToDelete = this.products.find(produt => produt.id === productId) || {
      id: 0,
      name: '',
      description: '',
      price: 0,
      made_date: new Date,
      expiry_date: new Date,
      image_url: ''
    };
    this.isConfirming = true;
  }

  hideConfirming() {
    this.isConfirming = false;
  }

  deleteProduct(productId: number) {
    this._productService.deleteProduct(productId).subscribe(
      (response) => {
        const responseData: any = response;
        const data: UpdateDelRes = JSON.parse(responseData);
        if(data.message === 'Product deleted successfully') {
          this.fetchProducts();
          this.reqSuccess = true;
          this.reqSuccessMessage = data.message;

          setTimeout(() => {
            this.reqSuccess = false;
            this.isConfirming = false;
          }, 1000);
        }
      },
      (error) => {
        const errorData: any = error;
        const message: Message = JSON.parse(errorData);
        this.reqIssue = true;
        this.reqIssueMessage = message.message;

        setTimeout(() => {
          this.reqIssue = false;
          this.isConfirming = false;
        }, 1000);
      }
    );
  }

  exportToExcel() {

  }

  exportPageToExcel() {

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
