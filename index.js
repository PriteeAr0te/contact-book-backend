import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import errorHandler from './middleware/contactMiddleware.js';
import cors from 'cors';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB()
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server Running on port: ${PORT}`);
})