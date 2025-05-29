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
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;