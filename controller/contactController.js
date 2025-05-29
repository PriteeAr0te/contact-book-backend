import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contact)
})

const createContact = asyncHandler(async (req, res) => {
    console.log("Request Body", req.body);

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All Fields are required.")
    }

    const contact = await Contact.create({ name, email, phone, user_id: req.user.id })
    res.status(201).json({ contact, isContactCreated: true })
})

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404).json({ messege: "Contact Not Found" })
    }
    res.status(200).json(contact)
})

const updateContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ messege: "Contact Not Found" })
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Dont have permission to handle other contact")
    }

    const updatedContact = await Contact.FindByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updateContact)
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404).json({ messege: "Contact Not Found" })
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Dont have permission to handle other contact")
    }

    await Contact.deleteOne();
    res.status(200).json(contact)
})

export { getContacts, createContact, getContact, updateContact, deleteContact }