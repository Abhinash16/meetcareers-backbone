const express = require("express");
const blogController = require("../../controllers/blogController");

const router = express.Router();

// Create a new blog
router.post("/blogs", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blogId = await blogController.createBlog(title, content, tags);
    res.status(201).json({ success: true, blogId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific blog by ID
router.get("/blogs/:blogId", async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogController.getBlogById(blogId);
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all blogs
router.get("/blogs", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10, but you can change it as per your requirements
    const page = parseInt(req.query.page) || 1; // Default page is 1, but you can change it as per your requirements
    const blogs = await blogController.getBlogsByPage(limit, page);
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a blog by ID
router.put("/blogs/:blogId", async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, content } = req.body;
    await blogController.updateBlogById(blogId, title, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a blog by ID
router.delete("/blogs/:blogId", async (req, res) => {
  try {
    const blogId = req.params.blogId;
    await blogController.deleteBlogById(blogId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
