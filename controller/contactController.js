import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
import cloudinary from '../config/cloudinary.js';
import { extractPublicId } from '../utils/extractPublicId.js';


const getContacts = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { search, tag, isFavorite, page = 1, limit = 3, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const query = { user_id };

    if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
            { name: regex },
            { email: regex },
            { phone: regex },
            { address: regex },
            { notes: regex },
        ];
    }

    if (isFavorite === 'true') {
        query.isFavorite = true;
    }

    if (tag) {
        query.tags = tag;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

    res.status(200).json({
        contacts,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNumber,
    });
});

const getStats = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const contacts = await Contact.find({ user: user_id });

    const totalContacts = contacts.length;
    const totalFavorites = contacts.filter(contact => contact.isFavorite).length;

    const tagMap = {};

    contacts.forEach((contact) => {
        if (Array.isArray(contact.tags)) {
            contact.tags.forEach((tag) => {
                const key = tag.toLowerCase();
                tagMap[key] = (tagMap[key] || 0) + 1;
            });
        }
    });

    return res.status(200).json({
        contacts,
        totalContacts,
        totalFavorites,
        uniqueTags: tagMap,
    });

})

const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, profilePicture, profilePicturePublicId } = req.body

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All Fields are required.")
    }

    const existingContact = await Contact.findOne({
        user_id: req.user._id,
        email: email,
        name: name,
        phone: phone
    });

    if (existingContact) {
        res.status(400).json({ messege: "Contact already exist with this name, email and phone number." })
        return;
    }

    let profilePictureUrl = '';
    if (req.file) {
        profilePictureUrl = req.file.path;
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
        profilePicture,
        profilePicturePublicId,
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
    const contactId = req.params.id;
    const userId = req.user.id;

    const contact = await Contact.findById(contactId);
    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.user_id.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to update this contact" });
    }

    const existingContact = await Contact.findOne({
        user_id: userId,
        email: req.body.email,
        name: req.body.name,
    });

    if (existingContact && existingContact._id.toString() !== contactId) {
        return res.status(400).json({ message: "Contact already exists with this name and email." });
    }

    const newImageUrl = req.body.profilePicture;

    if (
        newImageUrl &&
        newImageUrl !== contact.profilePicture &&
        contact.profilePicturePublicId
    ) {
        try {
            await cloudinary.uploader.destroy(contact.profilePicturePublicId);
        } catch (err) {
            console.warn("Failed to delete old image from Cloudinary:", err.message);
        }
    }

    const updatedFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        isFavorite: req.body.isFavorite,
        notes: req.body.notes,
        tags: req.body.tags,
        profilePicture: newImageUrl || contact.profilePicture,
        profilePicturePublicId: newImageUrl
            ? extractPublicId(newImageUrl)
            : contact.profilePicturePublicId,
    };

    const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedFields, {
        new: true,
    });

    res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404).json({ messege: "Contact Not Found" })
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Dont have permission to handle other contact")
    }

    if (contact.profilePicturePublicId) {
        await cloudinary.uploader.destroy(contact.profilePicturePublicId);
    }

    await contact.deleteOne();
    res.status(200).json(contact)
})

export { getContacts, createContact, getContact, updateContact, deleteContact, getStats }