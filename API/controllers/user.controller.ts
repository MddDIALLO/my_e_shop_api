const bcrypt = require("bcrypt");
import user from '../db/user';
import { User } from '../models/user';
import { Request, Response } from 'express';

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

const addNewUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let originalPassWord: string = password; 

        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }

        // Hash the password
        bcrypt.hash(originalPassWord, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send({ message: 'Password hashing failed' });
            }

            const newUser: User = {
                id: 0,
                username: username,
                email: email,
                password: hashedPassword,
                role_id: 2,
                created_by: 1,
                updated_by: 1,
                created_date: new Date(),
                updated_date: new Date()
            };

            console.log(newUser);

            // Add the user
            try {
                const insertedId = await user.addUser(newUser);
                res.status(200).send({
                    message: 'User added successfully',
                    userId: insertedId
                });
            } catch (error) {
                console.error('Error adding user:', error);
                res.status(500).send({ message: 'Failed to add user' });
            }
        });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateExistingUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser: User = {
            username: username,
            email: email,
            password: hashedPassword,
            updated_date: new Date()
        };

        const updated = await user.updateUser(userId, updatedUser);

        if (updated) {
            res.status(200).send({
                message: 'User updated successfully',
                userId: userId
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const deleted = await user.deleteUser(userId);

        if (deleted) {
            res.status(200).send({
                message: 'User deleted successfully',
                userId: userId
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getAll, addNewUser, updateExistingUser, deleteUserById };