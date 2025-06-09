import express from 'express';
import { getContacts, createContact, getContact, updateContact, deleteContact, getStats, shareContact, getSharedContacts } from '../controller/contactController.js';
import validateToken from '../middleware/validateTokenHandler.js';

const router = express.Router();

router.get('/', validateToken, getContacts);

router.get('/stats', validateToken, getStats);

router.post('/', validateToken, createContact);

router.get('/:id', validateToken, getContact);

router.put('/:id', validateToken, updateContact);

router.post('/:id/share', validateToken, shareContact);

router.get("/shared", validateToken, getSharedContacts);

router.delete('/:id', validateToken, deleteContact);

export default router;