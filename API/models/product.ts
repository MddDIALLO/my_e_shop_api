export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    made_date: Date;
    expiry_date: Date;
    image_url: string;
}

export interface Item {
    product: Product;
    quantity: number;
    deliveryDate: string;
    shipping: number;
}