import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contact)
})

const createContact = asyncHandler(async (req, res) => {
    console.log("Request Body", req.body);

    const { name, email, phone } = req.body;
    if (!name || !email || !phone ) {
        res.status(400);
        throw new Error("All Fields are required.")
    }
    
    const existingContact = await Contact.findOne({
        user_id: req.user._id,
        email:email,
        name: name,
        phone: phone
    });

    if(existingContact) {
        res.status(400).json({messege: "Contact already exist with this name, email and phone number."})
        return;
    }

    let profilePictureUrl = '';
    if(req.file) {
        profilePictureUrl = `/uploads/${req.file.filename}`; 
    }

    const contact = await Contact.create({ 
        name, 
        email, 
        phone, 
        user_id: req.user.id, 
        profilePicture: profilePictureUrl,
        ...req.body 
    });
    if (!contact) {
        res.status(400);
        throw new Error("Contact Not Created")
    }
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

    const existingContact = await Contact.findOne({
        user_id : req.user._id,
        email: req.body.email,
        name: req.body.name,
    });

    if( existingContact && existingContact._id.toString() !== req.params.id) {
        res.status(400).json({messege: "Contact already exist with this name and email."})
        return;
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedContact)
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

    await contact.deleteOne();
    res.status(200).json(contact)
})

export { getContacts, createContact, getContact, updateContact, deleteContact }