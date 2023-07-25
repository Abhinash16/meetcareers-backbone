const admin = require("firebase-admin");
const db = admin.database();

const generateBlogIdFromTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

// Create a new blog
// Create a new blog
const createBlog = (title, content, tags) => {
  const blogId = generateBlogIdFromTitle(title);

  const newBlogRef = db.ref("blogs").child(blogId);

  const newBlogData = {
    title: title,
    content: content,
    tags: tags,
  };

  return newBlogRef
    .set(newBlogData)
    .then(() => {
      return blogId;
    })
    .catch((error) => {
      throw new Error("Error creating blog:", error);
    });
};

// Get a specific blog by ID
const getBlogById = (blogId) => {
  return db
    .ref(`blogs/${blogId}`)
    .once("value")
    .then((snapshot) => {
      const blog = snapshot.val();
      return blog;
    })
    .catch((error) => {
      throw new Error("Error getting blog:", error);
    });
};

// Get blogs with limit and page
const getBlogsByPage = (limit, page) => {
  return db
    .ref("blogs")
    .once("value")
    .then((snapshot) => {
      const blogs = snapshot.val();
      return blogs;
    })
    .catch((error) => {
      throw new Error("Error getting all blogs:", error);
    });
};

// Update a blog by ID
const updateBlogById = (blogId, title, content) => {
  const updatedBlogData = {
    title: title,
    content: content,
  };

  return db
    .ref(`blogs/${blogId}`)
    .update(updatedBlogData)
    .then(() => {
      return true;
    })
    .catch((error) => {
      throw new Error("Error updating blog:", error);
    });
};

// Delete a blog by ID
const deleteBlogById = (blogId) => {
  return db
    .ref(`blogs/${blogId}`)
    .remove()
    .then(() => {
      return true;
    })
    .catch((error) => {
      throw new Error("Error deleting blog:", error);
    });
};

module.exports = {
  createBlog,
  getBlogById,
  getBlogsByPage,
  updateBlogById,
  deleteBlogById,
};
