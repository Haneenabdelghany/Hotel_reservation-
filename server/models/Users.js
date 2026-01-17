import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default:false },
    register_date: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);