import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter the username.']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email.'],
        unique: [true, 'Email already exists.']
    },
    password: {
        type: String,
        required: [true, 'Please enter password.']
    },
    profilePhoto: {
        type: String,
        default: null,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;