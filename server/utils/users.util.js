import User from "../models/Users.js";
import { hashPassword, verifyPassword } from "./hash.util.js";
import { createToken } from "./auth.util.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Users found', data: users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', data: null });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json({ message: 'User found', data: user });
        } else {
            res.status(404).json({ message: 'User not found', data: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', data: null });
    }
}

export const createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', data: null });
        }
        const newUser = await User.create({
            ...req.body,
            password: await hashPassword(req.body.password, process.env.SALT_ROUNDS)
        });
        const token = createToken({ id: newUser._id });
        res.status(201).json({ message: 'User created successfully', data: { ...newUser.toObject(), token } });
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
}

export const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({ message: 'User updated successfully', data: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found', data: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', data: null });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
        } else {
            res.status(404).json({ message: 'User not found', data: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', data: null });
    }
}

export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found', data: null });
        }


        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password', data: null });
        }

        user.password = undefined;
        const token = createToken({ id: user._id });

        res.status(200).json({
            message: 'User authenticated successfully',
            data: { ...user.toObject(), token }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate user', data: null });
    }
}

export const authAdmin = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).select('isAdmin');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "The authenticated user was not found in the system"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Insufficient privileges",
                message: "This action requires admin privileges",
                isAdmin: false
            });
        }

        req.adminUser = user;
        next();

    } catch (error) {
        console.error('Admin verification failed:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID",
                message: "The provided user identifier is invalid"
            });
        }

        return res.status(500).json({
            success: false,
            error: "Admin verification failure",
            message: "Internal server error during admin verification"
        });
    }
};