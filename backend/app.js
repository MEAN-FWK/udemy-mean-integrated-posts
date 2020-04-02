const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const Post = require("./models/post");

mongoose
  .connect(
    "mongodb+srv://intrepido:baddog@cluster0-zhxl3.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.get("/api/posts", (req, res, next) => {
  return Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched succesfully",
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Posts deleted!"
    });
  });
});

module.exports = app;
