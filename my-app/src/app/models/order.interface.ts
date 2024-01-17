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
  product_id: number;
  quantity: number;
  deliveryDate: string
  shipping: number;
}

export interface Got_Order_Item {
  product: Product;
  quantity: 0,
  deliveryDate: '',
  shipping: 0
}
export interface Got_Order {
  id: number;
  user_id: number;
  status: string;
  created_date: Date;
  updated_date: Date;
  total_cost: number;
  items: Got_Order_Item[];
}

export interface Order_Res {
  message: string;
  result: Got_Order[];
}
