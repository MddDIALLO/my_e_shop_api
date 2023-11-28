
import { Router, Request, Response } from 'express';
import productDB from '../db/product';
import { Product } from '../models/product';
import orderDB from '../db/order';
import { Order } from '../models/order';
import { Order_item } from '../models/order_item';

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const ordersList: Order[] = await orderDB.getAllOrders();
        const ordersReturnedList: any[] = [];

        for (const orderItem of ordersList) {
            const orderItems: Order_item[] = await orderDB.getAllOrderItems(orderItem.id);
            const products: Product[] = [];

            for (const orderItemDetail of orderItems) {
                const fetchedProduct: Product | null = await productDB.getProductById(orderItemDetail.product_id);

                if (fetchedProduct) {
                    products.push(fetchedProduct);
                }
            }

            ordersReturnedList.push({
                "id": orderItem.id,
                "user_id": orderItem.user_id,
                "status": orderItem.status,
                "created_date": orderItem.created_date,
                "updated_date": orderItem.updated_date,
                "total_cost": orderItem.total_cost,
                "products": products
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
        const products: Product[] = [];

        for (const orderItem of orderItems) {
            const fetchedProduct: Product | null = await productDB.getProductById(orderItem.product_id);

            if (fetchedProduct) {
                products.push(fetchedProduct);
            }
        }

        const orderDetails = {
            "id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "created_date": order.created_date,
            "updated_date": order.updated_date,
            "total_cost": order.total_cost,
            "products": products
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
        const { products } = req.body;
        let cost: number = 0;

        if(!products) {
            res.status(400).send({ message: 'You must add products for any order like this { "products": [{product_id, quantity},] } ' });
        }

        for (const item of products) {
            const product: Product | null = await productDB.getProductById(item.product_id);
            
            if(product) {
                cost += item.quantity * product.price;
            }
        }

        const newOrder: Order = {
            id: 0,
            user_id: 3,
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
        } catch (error) {
            console.error('Error adding Order:', error);
            res.status(500).send({ message: 'Failed to add Order' });
        }

        const newOrderItems: Order_item[] = [];

        for (const productData of products) {
            const { product_id, quantity } = productData;
            const newOrderItem: Order_item = {
                order_id: orderID,
                product_id,
                quantity
            }

            try {
                const insertedId = await orderDB.addNewOrderItem(newOrderItem);
                console.log("Order Item added successfully", insertedId)
            } catch (error) {
                console.error('Error adding Order_item:', error);
            }

            newOrderItems.push(newOrderItem);
        }

        const productsForOrder: Product[] = [];
        for (const orderItem of newOrderItems) {
            const fetchedProduct: Product | null = await productDB.getProductById(orderItem.product_id);

            if (fetchedProduct) {
                productsForOrder.push(fetchedProduct);
            }
        }

        const orderDetails: Order = {
            id: newOrder.id,
            user_id: newOrder.user_id,
            status: newOrder.status,
            created_date: newOrder.created_date,
            updated_date: newOrder.updated_date,
            total_cost: newOrder.total_cost
        };

        res.status(201).send({
            message: 'New order created',
            result: {
                order: orderDetails,
                products: productsForOrder
            }
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
        const { status, productsToAdd, productsToRemove } = req.body;

        const existingOrder: Order | null = await orderDB.getOrderById(orderId);

        if (!existingOrder) {
            return res.status(404).send({
                message: 'Order not found'
            });
        }

        if(!status && !productsToAdd && !productsToRemove) {
            return res.status(404).send({
                message: "You must specify update elements like this:",
                status: "in (created, sent, delivered, canceled)", 
                productsToAdd: "[{product_id, quantity}]",
                productsToRemove: "[{product_id}]"
            });
        }

        if (status) {
            existingOrder.status = status;
        }

        if (productsToAdd && productsToAdd.length > 0) {
            for (const productData of productsToAdd) {
                const { product_id, quantity } = productData;
                let orderItem: Order_item = await orderDB.getOrderItem(orderId, product_id);

                if(orderItem) {
                    orderItem.quantity += quantity;
                    const stat = await orderDB.updateOrderItem(orderId, product_id, orderItem);

                    if(stat) {
                        console.log("Order Item Quantity updated.");
                    } else {
                        console.log("Order Item Quantity updat failed.")
                    }
                } else {
                    const stat = await orderDB.addNewOrderItem({order_id: orderId, product_id, quantity});

                    if(stat) {
                        console.log("Order Item added.");
                    } else {
                        console.log("Order Item add failed.")
                    }
                }
            }
        }

        if (productsToRemove && productsToRemove.length > 0) {
            for (const productData of productsToRemove) {
                const { product_id } = productData;

                let orderItem: Order_item = await orderDB.getOrderItem(orderId, product_id);

                if(orderItem) {
                    const stat = await orderDB.deleteOrderItem(orderId, product_id);

                    if(stat) {
                        console.log("Order Item removed.");
                    } else {
                        console.log("Order Item remove failed.")
                    }
                } else {
                    console.log("Order Item not found.");
                }
            }
        }

        const orderItems: Order_item[] = await orderDB.getAllOrderItems(orderId);
        let cost: number = 0;

        if(orderItems) {
            for (const item of orderItems) {
                const product: Product | null = await productDB.getProductById(item.product_id);
                
                if(product) {
                    cost += item.quantity * product.price;
                }
            }
        }
        
        existingOrder.total_cost = cost;

        const orderUpdatetat: boolean = await orderDB.updateOrder(orderId, existingOrder);

        if(orderUpdatetat) {
            res.status(200).send({
                message: 'Order updated successfully',
                result: existingOrder
            });
        } else {
            res.status(200).send({
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

const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const orderId: number = Number(req.params.id);
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

export default { getAllOrders, getOrderById, addNewOrder, updateOrder, deleteOrderById };