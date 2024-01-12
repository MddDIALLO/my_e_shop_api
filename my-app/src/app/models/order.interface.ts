import { Product } from "./product.interface";

export interface New_Order {
  id: number;
  user_id: number;
  status: string;
  created_date: Date;
  updated_date: Date;
  total_cost: number;
}

export interface Order_Item {
  product: Product;
  quantity: number;
  deliveryDate: string;
  shipping: number;
}

export interface Got_Order {
  order: New_Order;
  items: Order_Item;
}
