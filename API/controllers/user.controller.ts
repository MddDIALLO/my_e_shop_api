const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Request, Response } from 'express';
import user from '../db/user';
import { User } from '../models/user';
import orderDB from '../db/order';
import { Order } from '../models/order';

const login = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let existingUser: User | null = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role_id: 2,
            created_by: 1,
            updated_by: 1,
            created_date: new Date(),
            updated_date: new Date()
        };

        if(username) {
            existingUser = await user.getUserByUsernameOrEmail(username);
        } else if(email){
            existingUser = await user.getUserByUsernameOrEmail(email);
        }

        if (!existingUser || existingUser.id === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const tokenPayload = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role_id: existingUser.role_id
        };

        const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).send({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getAll = (req: Request, res: Response) => {
    user.selectAll().then(users => {
        res.status(200).send({
            message: 'Users List',
            result: users
        })
    }).catch(err => {
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).send({ message: 'Invalid user ID' });
        }

        const userResult = await user.getUserById(userId);

        if (userResult) {
            res.status(200).send({
                message: 'User found',
                user: userResult
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const addNewUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role_id } = req.body;

        if(role_id && !req.isAuthToManRole) {
            return res.status(403).send({ message: 'Access denied. You are not authorized to manage user role.' });
        }

        const exitingUsername: User | null = await user.getUserByUsernameOrEmail(username);
        const exitingEmail: User | null = await user.getUserByUsernameOrEmail(email);

        if(exitingUsername) {
            return res.status(400).send({ message: 'Username already used' });
        }

        if(exitingEmail) {
            return res.status(400).send({ message: 'Email already used' });
        }

        const newUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role_id: 2,
            created_by: 1,
            updated_by: 1,
            created_date: new Date(),
            updated_date: new Date()
        };

        if(username) {
            if(username.length >= 3) {
                newUser.username = username;
            } else {
                return res.status(400).send({ message: 'Invalid username: it must contain at lest three characters' });
            }
        } else {
            return res.status(400).send({ message: 'Username is required' });
        }

        if(email) {
            const isValidEmail = user.validateEmail(email);

            if (isValidEmail) {
                newUser.email = email;
            } else {
                return res.status(400).send({ message: 'Invalid Email Adress: It must be like "example@example.com"' });
            }
        } else {
            return res.status(400).send({ message: 'Email is required' });
        }

        if(password) {
            const isValidPassword = user.validatePassword(password);

            if (isValidPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);

                newUser.password = hashedPassword;
            } else {
                return res.status(400).send({ message: 'Invalid Password' });
            }
        } else {
            return res.status(400).send({ message: 'Password is required' });
        }

        if(req.isAuthToManRole) {
            if(role_id) {
                if(parseInt(role_id, 10) === 1 || parseInt(role_id, 10) === 2) {
                    newUser.role_id = role_id;
                } else {
                    return res.status(400).send({ message: 'Invalid role' });
                }
            }
        }

        if(req.user?.id) {
            newUser.created_by = req.user.id;
            newUser.updated_by = req.user.id;
        }

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
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateExistingUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const { password, role_id } = req.body;

        if(role_id && !req.isAuthToManRole) {
            return res.status(403).send({ message: 'Access denied. You are not authorized to manage user role.' });
        }

        let updatedUser: User = {
            id: 0,
            username: '',
            email: '',
            password: '',
            role_id: 0,
            created_by: 0,
            updated_by: 0,
            created_date: new Date(),
            updated_date: new Date()
        };

        const userResult = await user.getUserById(userId);

        if (userResult) {
            updatedUser = userResult;
        } else {
            return res.status(404).send({ message: 'User not found' });
        }

        if (password) {
            const isValidPassword = user.validatePassword(password);

            if (isValidPassword) {
                const hashedPassword = await bcrypt.hash(password, 10);

                updatedUser.password = hashedPassword;
            } else {
                return res.status(400).send({ message: 'Invalid Password' });
            }
        }

        if(req.isAuthToManRole) {
            if(role_id) {
                if(parseInt(role_id, 10) === 1 || parseInt(role_id, 10) === 2) {
                    updatedUser.role_id = parseInt(role_id, 10);
                } else {
                    return res.status(400).send({ message: 'Invalid role' });
                }
            }
        }

        updatedUser.updated_by = req.user.id;
        updatedUser.updated_date = new Date();

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
        const userOrders: Order[] = await orderDB.getUserOrders(userId);

        if(userOrders) {
            for (const item of userOrders) {
                await orderDB.deleteOrderItems(item.id);
                await orderDB.deleteOrder(item.id);
            }
        }

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

export default { login, getAll, getUserById, addNewUser, updateExistingUser, deleteUserById };