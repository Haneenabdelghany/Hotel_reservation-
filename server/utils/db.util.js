import mongoose from 'mongoose';

const connectDB = async () => {
    const url = process.env.MONGODB_URL;
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected via Railway');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;