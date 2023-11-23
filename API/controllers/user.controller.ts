import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import user from '../db/user';
import { User } from '../models/user';

const getAll = (req: Request, res: Response) => {
    user.selectAll().then(users => {
        res.status(200).send({
            message: 'OK',
            result: users
        })
    }).catch(err => {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}

const addNewUser = (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const newUser: User = {
        id: 0,
        username: username,
        email: email,
        password: bcrypt.hash(password, 10),
        role_id: 2,
        created_by: 1,
        updated_by: 1,
        created_date: new Date(),
        updated_date: new Date()
    };

    user.addUser(newUser)
        .then(insertedId => {
            res.status(200).send({
                message: 'User added successfully',
                userId: insertedId
            });
        })
        .catch(error => {
            res.status(500).send({
                message: 'Failed to add user',
                error: error.code
            });
        });
};

export default { getAll, addNewUser };