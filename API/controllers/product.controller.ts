import { Router, Request, Response } from 'express';
import product from '../db/product';

const getAll = (req: Request, res: Response) => {
    product.selectAll().then(products => {
        res.status(200).send({
            message: 'OK',
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

export default { getAll, getProductById };