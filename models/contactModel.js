import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Enter a valid email'],
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address : {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    trim: true,
    default: null, 
  },
}, {
  timestamps: true,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
