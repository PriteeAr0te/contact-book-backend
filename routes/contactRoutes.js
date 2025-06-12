import express from 'express';
import { getContacts, deleteContact, createContact, getContact, updateContact, getStats, shareContact, mySharedContacts, markSharedContactsAsViewed, checkUnseenSharedContacts } from '../controller/contactController.js';
import validateToken from '../middleware/validateTokenHandler.js';

const router = express.Router();

router.get('/', validateToken, getContacts);

router.delete('/:id', validateToken, deleteContact);

router.get('/shared', validateToken, mySharedContacts)

router.get('/shared-status', validateToken, checkUnseenSharedContacts);

router.get('/stats', validateToken, getStats);

router.post('/', validateToken, createContact);

router.get('/:id', validateToken, getContact);

router.put('/:id', validateToken, updateContact);

router.post('/:id/share', validateToken, shareContact);

router.put('/shared/viewed', validateToken, markSharedContactsAsViewed);


export default router;