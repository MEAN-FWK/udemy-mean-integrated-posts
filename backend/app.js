const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "asdf4534523",
      title: "First server-side post",
      content: "This is coming from the server "
    },
    {
      id: "tytryr67567",
      title: "Second server-side post",
      content: "This is coming from the server "
    }
  ];
  return res.status(200).json({
    message: 'Posts fetched succesfully',
    posts: posts
  });
});

module.exports = app;
