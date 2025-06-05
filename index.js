import dotenv from 'dotenv';
import express from 'express';
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
  // origin: "http://localhost:5173",
  origin: process.env.FRONTEND_URL || "https://smart-contact-book.netlify.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.use('/', (req, res) => {
  res.send('API is running...');
})


app.listen(PORT, () => {
  console.log(`Server Running on port: ${PORT}`);
})