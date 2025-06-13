const Post = require('../models/post');

exports.index = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.render('index', { posts });
  } catch (err) {
    next(err);
  }
};
