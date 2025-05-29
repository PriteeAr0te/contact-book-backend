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
}, {
  timestamps: true,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
