import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './common/jwt.interceptor';
import { AppComponent } from './app.component';
import { HeaderComponent } from './container/header/header.component';
import { HomeComponent } from './container/home/home.component';
import { LoginComponent } from './container/login/login.component';
import { LogoutComponent } from './container/logout/logout.component';
import { RegisterComponent } from './container/register/register.component';
import { AdminComponent } from './container/admin/admin.component';
import { ProfileComponent } from './container/profile/profile.component';
import { UsersComponent } from './container/admin/users/users.component';
import { ProductsComponent } from './container/admin/products/products.component';
import { OrdersComponent } from './container/admin/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    AdminComponent,
    ProfileComponent,
    UsersComponent,
    ProductsComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
