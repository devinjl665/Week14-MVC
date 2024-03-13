const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({ ...req.body, userId: req.session.userId });
        console.log("This is a new post", newPost);
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
}); 

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedPost = await Post.update(
          {
            title: req.body.title,
            content: req.body.content,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        if (!updatedPost) {
          res.status(404).json({ message: 'This id has no post' });
          return;
        }  
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
          where: { postId: req.params.id },
      });

    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });
    if (!postData) {
      res.status(404).json({
        message: `No User Id ${req.session.userId} found with id = ${req.params.id}`,
      });
      return;
    }

    res.status(200).json(postData);
    } catch (err) {
    res.status(500).json(err);
    }
});

module.exports = router;