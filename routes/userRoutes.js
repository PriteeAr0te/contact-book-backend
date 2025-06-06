import express from 'express';
import { registerUser, loginUser, currentUser, updateCurrentUser } from '../controller/userController.js';
import validateToken from '../middleware/validateTokenHandler.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', validateToken, currentUser);

router.put('/me', validateToken, updateCurrentUser)

export default router;