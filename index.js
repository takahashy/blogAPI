// SERVER SIDE
// This is what the API manages from the user calling it. 
// *change the username and password to connect to database

import express, { response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import { post } from "jquery";

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://<username>:<password>@blog.riftjsk.mongodb.net/BLOGS")

// The schema and the model for the blog stored in mongodb
const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: Date
});
const Blog = mongoose.model("Blog", BlogSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET All posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await Blog.find({});
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

// GET a specific post by id
app.get("/posts/:id", async (req, res) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        res.status(404).json({ message: `ID: ${req.params.id} was not found`});
    }
    res.json(post);
});

// POST a new post
app.post("/posts", (req, res) => {
    const new_post = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date()
    });
    new_post.save();
    res.status(200).json(new_post);
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async (req, res) => {
    const post = await Blog.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    if (!post) res.status(400).json({ message: "post NOT FOUND" });
    res.json(post);
}); 

// DELETE a specific post by providing the post id.
app.delete("/posts/:id", async (req, res) => {
    try {
        const deleted_blog = await Blog.findByIdAndDelete(req.params.id);
        if (deleted_blog !== null) console.log(deleted_blog);
        res.status(200).json();
    } catch (err) {
        console.log(`${err}`);
    }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
