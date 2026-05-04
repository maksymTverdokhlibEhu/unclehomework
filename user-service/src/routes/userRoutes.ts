import { Router } from 'express';
import { createUser, deleteUserById, getUserById, getUsers, updateUserById } from '../controllers/userController';

const userController = Router();

userController.get('/users', getUsers);
userController.get('/users/:id', getUserById);
userController.put('/users/:id', updateUserById);
userController.delete('/users/:id', deleteUserById);
userController.post('/users/user', createUser);

export default userController;
