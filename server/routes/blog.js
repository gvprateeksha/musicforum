const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// @route   GET api/blog
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        console.log('Fetching blog posts...');
        const posts = await BlogPost.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        
        console.log(`Found ${posts.length} posts`);
        res.json(posts);
    } catch (err) {
        console.error('Error in GET /api/blog:', err);
        res.status(500).json({ 
            message: 'Error loading blog posts',
            error: err.message 
        });
    }
});

// @route   POST api/blog
// @desc    Create a blog post
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating new blog post:', req.body);
        const { title, content, excerpt, image, tags } = req.body;

        // Validate required fields
        if (!title || !content || !excerpt) {
            return res.status(400).json({ 
                message: 'Please provide all required fields (title, content, excerpt)' 
            });
        }

        const newPost = new BlogPost({
            title,
            content,
            excerpt,
            image: image || 'https://via.placeholder.com/600x400?text=Blog+Post+Image',
            tags: tags || [],
            author: req.user.id
        });

        const post = await newPost.save();
        await post.populate('author', 'username');
        
        console.log('Blog post created successfully:', post._id);
        res.json(post);
    } catch (err) {
        console.error('Error in POST /api/blog:', err);
        res.status(500).json({ 
            message: 'Error creating blog post',
            error: err.message 
        });
    }
});

// @route   DELETE api/blog/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Attempting to delete blog post:', req.params.id);
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is authorized to delete the post
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        await post.remove();
        console.log('Blog post deleted successfully:', req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error in DELETE /api/blog/:id:', err);
        res.status(500).json({ 
            message: 'Error deleting blog post',
            error: err.message 
        });
    }
});

// @route   GET api/blog/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching blog post:', req.params.id);
        const post = await BlogPost.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.user', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Blog post found:', post._id);
        res.json(post);
    } catch (err) {
        console.error('Error in GET /api/blog/:id:', err);
        res.status(500).json({ 
            message: 'Error fetching blog post',
            error: err.message 
        });
    }
});

//likes
router.post('/:id/like', auth, async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Post not found' });
    
        const userLikeIndex = blog.likes.indexOf(req.user.id);
        if (userLikeIndex > -1) {
            // User already liked, so unlike
            blog.likes.splice(userLikeIndex, 1);
        } else {
            // Add new like
            blog.likes.push(req.user.id);
        }
    
        await blog.save();
        const updatedBlog = await BlogPost.findById(req.params.id)
            .populate('author', 'username')
            .populate('likes');
            
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error in liking post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//comments
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const blog = await BlogPost.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Post not found' });
    
        blog.comments.push({
            user: req.user.id,
            text: comment
        });
    
        await blog.save();
        
        const updatedBlog = await BlogPost.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.user', 'username');
    
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
