import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/dbConnection.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';
import errorHandler from './middleware/contactMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://smart-contact-book.netlify.app'
];


app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
    
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,      
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

app.use('/api/contacts', contactRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/upload',   uploadRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
