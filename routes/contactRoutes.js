import express from 'express';
import { getContacts, createContact, getContact, updateContact, deleteContact, getStats } from '../controller/contactController.js';
import validateToken from '../middleware/validateTokenHandler.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/', validateToken, getContacts);

router.get('/stats', validateToken, getStats);

router.post('/', validateToken, upload.single('profilePicture'), createContact);

router.get('/:id', validateToken, getContact);

router.put('/:id', validateToken, upload.single('profilePicture'), updateContact);

router.delete('/:id', validateToken, deleteContact);

export default router;