export interface Order_item {
    order_id: number;
    product_id: number;
    quantity: number;
    deliveryDate: string;
    shipping: number;
}

export interface GotItem {
    product_id: number; 
    quantity: number; 
    deliveryDate: string
    shipping: number;
}