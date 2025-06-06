import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All Fields are necessary")
    }

    const isUserAvailable = await User.findOne({ email })
    if (isUserAvailable) {
        res.status(400);
        throw new Error("User Already Registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    console.log(`User Created ${user}`);

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid.");
    }
    res.json({ messege: "Regitser the user." })
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required.");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.SECRET_KEY,
            { expiresIn: "3d" }
        )
        res.status(200).json({
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } else {
        res.status(401);
        throw new Error("Invalid Credentials.")
    }

});

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        res.status(400)
        throw new Error("User not Found.")
    }

    res.status(200).json(user)
});

const updateCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { username, address, phone } = req.body;
    let profilePhoto = req.body.profilePhoto;

    if (req.file) {
        profilePhoto = req.file.path;
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }

    user.username = username || user.username;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.profilePhoto = profilePhoto || user.profilePhoto;

    const newImageUrl = req.body.profilePhoto;

    if (
        newImageUrl &&
        newImageUrl !== user.profilePhoto &&
        contact.profilePicturePublicId
    ) {
        try {
            await cloudinary.uploader.destroy(contact.profilePicturePublicId);
        } catch (err) {
            console.warn("Failed to delete old image from Cloudinary:", err.message);
        }
    }

    const updatedUser = await user.save();

    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        profilePhoto: updatedUser.profilePhoto

    })
})

export { registerUser, loginUser, currentUser, updateCurrentUser }