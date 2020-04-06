const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currenPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currenPage) {
    postQuery.skip(pageSize * (currenPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    }).catch(err => {
      return res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
}

exports.getPost = (req, res, next) => {
  return Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  }).catch(err => {
    return res.status(500).json({
      message: 'Fetching post failed!'
    });
  });
}

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(err => {
    return res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Update succesfully'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      });
    }
  }).catch(err => {
    return res.status(500).json({
      message: 'Updating a post failed!'
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Deletion successful!'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      });
    }
  }).catch(err => {
    return res.status(500).json({
      message: 'Deleting a post failed!'
    });
  });
}
