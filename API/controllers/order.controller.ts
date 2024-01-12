
import { Router, Request, Response } from 'express';
import productDB from '../db/product';
import { Product, Item } from '../models/product';
import orderDB from '../db/order';
import { Order } from '../models/order';
import { Order_item } from '../models/order_item';

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const ordersList: Order[] = await orderDB.getAllOrders();

        if(!ordersList || ordersList.length === 0) {
            return res.status(404).send({
                message: 'No Order not found'
            });
        }

        const ordersReturnedList: any[] = [];

        for (const orderItem of ordersList) {
            const orderItems: Order_item[] = await orderDB.getAllOrderItems(orderItem.id);
            const items: Item[] = [];
            const fetchedItem: Item = {
                product: {
                    id: 0,
                    name: '',
                    description: '',
                    price: 0.00,
                    made_date: new Date(),
                    expiry_date: new Date(),
                    image_url: ''
                },
                quantity: 0,
                deliveryDate: '',
                shipping: 0
            }

            for (const orderItemDetail of orderItems) {
                const fetchedProduct: Product | null = await productDB.getProductById(orderItemDetail.product_id);

                if (fetchedProduct) {
                    fetchedItem.product = fetchedProduct;
                    fetchedItem.quantity = orderItemDetail.quantity;
                    fetchedItem.deliveryDate = orderItemDetail.deliveryDate;
                    fetchedItem.shipping = orderItemDetail.shipping;
                    items.push(fetchedItem);
                }
            }

            ordersReturnedList.push({
                "id": orderItem.id,
                "user_id": orderItem.user_id,
                "status": orderItem.status,
                "created_date": orderItem.created_date,
                "updated_date": orderItem.updated_date,
                "total_cost": orderItem.total_cost,
                "items": items
            });
        }

        res.status(200).send({
            message: 'Orders List',
            result: ordersReturnedList
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        const orderId: number = parseInt(req.params.id);
        const order: Order | null = await orderDB.getOrderById(orderId);

        if (!order) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        const orderItems: Order_item[] = await orderDB.getAllOrderItems(order.id);
        const items: Item[] = [];
            const fetchedItem: Item = {
                product: {
                    id: 0,
                    name: '',
                    description: '',
                    price: 0.00,
                    made_date: new Date(),
                    expiry_date: new Date(),
                    image_url: ''
                },
                quantity: 0,
                deliveryDate: '',
                shipping: 0
            }

        for (const orderItem of orderItems) {
            const fetchedProduct: Product | null = await productDB.getProductById(orderItem.product_id);

            if (fetchedProduct) {
                fetchedItem.product = fetchedProduct;
                fetchedItem.quantity = orderItem.quantity;
                fetchedItem.deliveryDate = orderItem.deliveryDate;
                fetchedItem.shipping = orderItem.shipping;
                items.push(fetchedItem);
            }
        }

        const orderDetails = {
            "id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "created_date": order.created_date,
            "updated_date": order.updated_date,
            "total_cost": order.total_cost,
            "products": items
        };

        res.status(200).send({
            message: 'Order Details',
            result: orderDetails
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const addNewOrder = async (req: Request, res: Response) => {
    try {
        const { user_id, products, deliveryDate, shipping } = req.body;
        let cost: number = 0;
        let userId : number = 0;
        
        if(!req.addOrderAdmin) {
            if(!products) {
                return res.status(400).send({ 
                    message: 'You must add products for any order like this { products: [{product_id, quantity, deliveryDate, shipping},] } ' });
            }
        } else {
            if(!products || !user_id) {
                return res.status(400).send({ message: 'You must add products for any order like this { user_id: user_id, products: [{product_id, quantity},] } ' });
            }
        }

        if(!req.addOrderAdmin) {
            userId = req.user?.id;
        } else {
            userId = Number(user_id);
        }

        for (const item of products) {
            const product: Product | null = await productDB.getProductById(item.product_id);
            
            if(product) {
                cost += item.quantity * product.price;
            }
        }

        const newOrder: Order = {
            id: 0,
            user_id: userId,
            status: "pending",
            total_cost: cost,
            created_date: new Date(),
            updated_date: new Date()
        }

        let orderID: number = 0;

        try {
            const insertedId = await orderDB.addNewOrder(newOrder);

            console.log("Order added successfully", insertedId);
            orderID = insertedId;
            newOrder.id = insertedId;
        } catch (error) {
            console.error('Error adding Order:', error);
            res.status(500).send({ message: 'Failed to add Order' });
        }

        for (const productData of products) {
            const { product_id, quantity } = productData;
            const newOrderItem: Order_item = {
                order_id: orderID,
                product_id,
                quantity,
                deliveryDate,
                shipping
            }

            try {
                const insertedId = await orderDB.addNewOrderItem(newOrderItem);
                console.log("Order Item added successfully", insertedId)
            } catch (error) {
                console.error('Error adding Order_item:', error);
            }
        }

        res.status(201).send({
            message: 'New order created',
            orderId: orderID
        });
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};


const updateOrder = async (req: Request, res: Response) => {
    try {
        const orderId: number = parseInt(req.params.id);
        const { status } = req.body;

        const existingOrder: Order | null = await orderDB.getOrderById(orderId);

        if (!existingOrder) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        if (status && (status ==='prepared' || status ==='sent' || status === 'delivered' || status ==='canceled')) {
            existingOrder.status = status;
        }

        if(existingOrder && existingOrder.status === "sent") {
            return res.status(403).send({
                message: 'Order already sent it is impossible to update'
            });
        }

        if(existingOrder && existingOrder.status === "delivered") {
            return res.status(403).send({
                message: 'Order already delivered it is impossible to update'
            });
        }

        if (status && req.isAuthToManOrder) {
            existingOrder.status = status;
        }

        if(status && !req.isAuthToManOrder) {
            return res.status(403).send({
                message: "Permission denied to update Order status"
            });
        }

        const orderUpdatetat: boolean = await orderDB.updateOrder(orderId, existingOrder);

        if(orderUpdatetat) {
            res.status(200).send({
                message: 'Order updated successfully',
                orderId: existingOrder.id
            });
        } else {
            res.status(403).send({
                message: 'Order update failled',
            });
        }
        
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const cancelOrder = async (req: Request, res: Response) => {
    try {
        const orderId: number = parseInt(req.params.id);
        const existingOrder: Order | null = await orderDB.getOrderById(orderId);

        if (!existingOrder) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        if(existingOrder && existingOrder.status === "sent") {
            return res.status(403).send({
                message: 'Order already sent it is impossible to cancel'
            });
        }

        if(existingOrder && existingOrder.status === "delivered") {
            return res.status(403).send({
                message: 'Order already delivered it is impossible to cancel'
            });
        }

        existingOrder.status = "canceled";

        const orderUpdatetat: boolean = await orderDB.updateOrder(orderId, existingOrder);

        if(orderUpdatetat) {
            res.status(200).send({
                message: 'Order canceled successfully',
                orderId: existingOrder.id
            });
        } else {
            res.status(403).send({
                message: 'Order cancel failled',
            });
        }
        
    } catch (err) {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        });
    }
};

const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const orderId: number = Number(req.params.id);
        const existingOrder: Order | null = await orderDB.getOrderById(orderId);

        if (!existingOrder) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        if(existingOrder && existingOrder.status === "sent") {
            return res.status(403).send({
                message: 'Order already sent it is impossible to delete'
            });
        }

        if(existingOrder && existingOrder.status === "delivered") {
            return res.status(403).send({
                message: 'Order already delivered it is impossible to delete'
            });
        }

        const itemDeleted: boolean = await orderDB.deleteOrderItems(orderId);

        if (itemDeleted) {
            console.log("Order items deleted.");
        } else {
            console.log("Not able to delete order items.")
        }

        const orderDeleted: boolean = await orderDB.deleteOrder(orderId);

        if (orderDeleted) {
            res.status(200).send({
                message: 'Order deleted successfully',
                orderId: orderId
            });
        } else {
            res.status(404).send({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getAllOrders, getOrderById, addNewOrder, updateOrder, cancelOrder, deleteOrderById };