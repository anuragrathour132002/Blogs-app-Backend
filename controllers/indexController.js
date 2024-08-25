const { catchAsyncErrors } = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const { sendToken } = require('../utils/sendToken');
const bcrypt = require('bcryptjs');
const Comment=require('../models/commentModel')
const mongoose = require('mongoose');
const Post=require('../models/postModel')

// Controller to fetch the current authenticated user's information
exports.currentUser = catchAsyncErrors(async (req, res, next) => {
    try {
        // Retrieve user ID from the request object (set by the isAuthenticated middleware)
        const userId = req.id;

        // Find the user in the database based on the ID
        const user = await User.findById(userId);

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log(user)
        // Send user data in the response
        res.json({ success: true, user });
    } catch (error) {
        // Log the error and return a 500 status code for internal server error
        console.error('Error fetching current user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Controller to handle user signup/registration
exports.signUp = catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.body); // Check what is being received in the request body
        const { email, password,firstName,lastName } = req.body;

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create a new user instance
        const newUser = new User({ email, password,firstName,lastName });

        // Save the new user to the database
        await newUser.save();

        // Send a JWT token as a response
        sendToken(newUser, 201, res);
    } catch (error) {
        // Log the error and return a 500 status code for internal server error
        console.error('Error registering new user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Controller to handle user login
exports.login = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isPasswordMatch = await user.comparePassword(password);

        // If password does not match, return 401
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If everything is correct, send a JWT token as a response
        sendToken(user, 200, res);
    } catch (error) {
        // Log the error and return a 500 status code for internal server error
        console.error('Error in login controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Controller to handle user logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    // Clear the JWT token cookie
    res.clearCookie("token");

    // Send a success response
    res.json({ message: "Successfully signed out" });
});


exports.createPost = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, excerpt, content } = req.body;
        const { userId } = req.params;
console.log(req.body)
        // Validate required fields
        if (!title || !excerpt || !content || !userId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Create a new post
        const post = await Post.create({
            title,
            excerpt,
            content,
            userId,
        });

        // Send success response
        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        // Handle any errors that occurred during post creation
        return next(error);
    }
});


exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
    try {
        const posts = await Post.find(); // Fetch all posts

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        return next(error);
    }
});


exports.getPostById = catchAsyncErrors(async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id); // Fetch post by ID

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        console.log(post)

        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        return next(error);
    }
});


exports.deletePostById = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params; // Get the post ID from request parameters

        // Find and delete the post
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Delete all comments related to the deleted post
        await Comment.deleteMany({ postId: id });

        res.status(200).json({
            success: true,
            message: 'Post and related comments deleted successfully',
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});

exports.updatePostById = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, excerpt, content } = req.body;

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, excerpt, content },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        return next(error);
    }
});

exports.searchPosts = async (req, res) => {
    try {
        const { title } = req.query; // Extract title from query parameters
        const posts = await Post.find({
            title: { $regex: title, $options: 'i' } // Case-insensitive search
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching posts.' });
    }
};


exports.fetchComments = catchAsyncErrors(async (req, res, next) => {
    try {
        const { postId } = req.params; // Extract postId from request parameters

        // Fetch comments for the given postId
        const comments = await Comment.find({ postId: postId }).populate('userId', 'firstName lastName',); // Populate userId to get user details

        // Respond with the fetched comments
        res.status(200).json({
            success: true,
            comments: comments,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});

exports.addComments = catchAsyncErrors(async (req, res, next) => {
    try {
        const { postId, userId } = req.params; // Extract postId and userId from request parameters
        const { data } = req.body; // Extract the comment text from the request body

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Create the comment
        const comment = await Comment.create({
            postId: postId,
            userId: userId,
            text: data,
            createdAt: new Date(),
        });

        // Respond with the new comment
        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comment: comment,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
});
