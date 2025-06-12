import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/signature', (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder: 'ContactBook'
        },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: cloudinary.config().cloud_name,
        folder: 'ContactBook',
    });
});

export default router;
