const { Router } = require('express');
const config = require('config');
// const shortid = require('shortid');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl');
    const { title, text } = req.body;

    // const code = shortid.generate();
    console.log(req.user.userId);

    const candidate = await User.findById(req.user.userId);

    if (candidate.role !== 'admin') {
      return res.status(500).json({ message: 'Вы не администратор' });
    }

    const post = new Post({
      title,
      text,
      owner: req.user.userId,
    });

    await post.save();
    res.status(201).json({ post });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = router;
