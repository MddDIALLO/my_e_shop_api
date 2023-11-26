import { Router, Request, Response } from 'express';
import product from '../db/product';
import { Product } from '../models/product';

const getAll = (req: Request, res: Response) => {
    product.selectAll().then(products => {
        res.status(200).send({
            message: 'Products List',
            result: products
        })
    }).catch(err => {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}

const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);

        if (isNaN(productId)) {
            return res.status(400).send({ message: 'Invalid product ID' });
        }

        const productResult = await product.getProductById(productId);

        if (productResult) {
            res.status(200).send({
                message: 'Product found',
                product: productResult
            });
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const addNewProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const newProduct: Product = {
            id: 0,
            name: '',
            description: '',
            price: 0.00,
            created_by: 0,
            updated_by: 0,
            created_date: new Date(),
            updated_date: new Date()
        }

        if(name) {
            if(name.length >= 3) {
                newProduct.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid product name: it must contains at least 3 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Product name is required' });
        }

        if(description) {
            if(description.length > 15) {
                newProduct.description = description;
            } else {
                return res.status(400).send({ message: 'Invalid product description: it must contains at least 15 characters' });
            }
        } else {
            return res.status(400).send({ message: 'Product description is required' });
        }

        if(price) {
            if (parseInt(price, 10)) {
                newProduct.price = parseFloat(price);
            } else {
                return res.status(400).send({ message: 'Invalid Poduct price' });
            }
        } else {
            return res.status(400).send({ message: 'Poduct price is required' });
        }

        try {
            const insertedId = await product.addNewProduct(newProduct);
            res.status(200).send({
                message: 'Product added successfully',
                userId: insertedId
            });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send({ message: 'Failed to add product' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateExistingProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const { name, description, price } = req.body;
        let updatedProduct: Product = {
            id: 0,
            name: '',
            description: '',
            price: 0.00,
            created_by: 0,
            updated_by: 0,
            created_date: new Date(),
            updated_date: new Date()
        };

        const productResult = await product.getProductById(productId);

        if (productResult) {
            updatedProduct = productResult;
        } else {
            return res.status(404).send({ message: 'User not found' });
        }

        if(name) {
            if(name.length >= 3) {
                updatedProduct.name = name;
            } else {
                return res.status(400).send({ message: 'Invalid product name: it must contains at least 3 characters' });
            }
        }

        if(description) {
            if(description.length > 15) {
                updatedProduct.description = description;
            } else {
                return res.status(400).send({ message: 'Invalid product description: it must contains at least 15 characters' });
            }
        }

        if(price) {
            if (parseInt(price, 10)) {
                updatedProduct.price = parseFloat(price);
            } else {
                return res.status(400).send({ message: 'Invalid Poduct price' });
            }
        }

        const updated = await product.updateProduct(productId, updatedProduct);

        if (updated) {
            res.status(200).send({
                message: 'Product updated successfully',
                productId: productId
            });
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteProductById = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const deleted = await product.deleteProduct(productId);

        if (deleted) {
            res.status(200).send({
                message: 'Product deleted successfully',
                productId: productId
            });
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getAll, getProductById, addNewProduct, updateExistingProduct, deleteProductById };