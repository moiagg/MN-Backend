const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Loads Model
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");

// Loads Validation
const validatePostInput = require("../../validation/post");

// @route GET api/posts/test
// @desc TESTS POST ROUTE
// @access Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Posts Works"
  });
});

// @route GET api/posts
// @desc Get Post
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({
        nopostsfound: "No posts found"
      })
    );
});

// @route GET api/posts/:id
// @desc Get Post
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found with that ID"
      })
    );
});

// @route POST api/posts
// @desc Create Post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check Validation
    if (!isValid) {
      // If any errors, sen 400 w/ errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE api/posts/:id
// @desc Get Post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not authorized"
            });
          }

          // Delete
          post.remove().then(() =>
            res.json({
              success: true
            })
          );
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not Found"
          })
        );
    });
  }
);

// @route Post api/posts/like/:id
// @desc Like Post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({
              alreadyliked: "User already liked this post"
            });
          }

          //add user id to likes array
          post.likes.unshift({
            user: req.user.id
          });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not Found"
          })
        );
    });
  }
);

// @route Post api/posts/undislike/:id
// @desc unLike Post
// @access Private
router.post(
  "/undislike/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.dislikes.filter(
              dislike => dislike.user.toString() === req.user.id
            ).length === 0
          ) {
            return res.status(400).json({
              notdisliked: "You have not yet disliked this post"
            });
          }

          //Get Remove Index
          const removeIndex = post.dislikes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Splice array
          post.dislikes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not Found"
          })
        );
    });
  }
);

// @route Post api/posts/like/:id
// @desc Like Post
// @access Private
router.post(
  "/dislike/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.dislikes.filter(
              dislike => dislike.user.toString() === req.user.id
            ).length > 0
          ) {
            return res.status(400).json({
              alreadydisliked: "User already disliked this post"
            });
          }

          //add user id to dislikes array
          post.dislikes.unshift({
            user: req.user.id
          });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not Found"
          })
        );
    });
  }
);

// @route Post api/posts/unlike/:id
// @desc unLike Post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({
              notliked: "You have not yet liked this post"
            });
          }

          //Get Remove Index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Splice array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not Found"
          })
        );
    });
  }
);

// @route Post api/posts/comment/:id
// @desc Add Comment
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check Validation
    if (!isValid) {
      // If any errors, sen 400 w/ errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: "No post found"
        })
      );
  }
);

// @route Post api/posts/comment/:id/:comment_id
// @desc Remove Comment
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comments exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // SPlice Comment out of Array
        post.comments.splice(removeIndex, 1);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: "No post found"
        })
      );
  }
);
module.exports = router;
