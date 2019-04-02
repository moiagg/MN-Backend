const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../../config/key");
// Load User Model
const Auth = require("../../models/Auth");
// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateAuthInput = require("../../validation/auth");
// @route GET api/auth/test
// @desc TESTS AUTH ROUTE
// @access Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Auth Works"
  });
});

// Authorizes User, Logs in or Creates New User
router.post("/auth", (req, res) => {
  const { errors, isValid } = validateAuthInput(req.body);
  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  //find user email
  Auth.findOne({
    email
  }).then(user => {
    //check for User
    if (!user) {

      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // Default
      });

      const newUser = new Auth({
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      })
    } else {
      //check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User Matched
          const payload = {
            // Creates JWT Payload
            id: user.id,
            avatar: user.avatar
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      })
    }


  });
});

// @route GET api/auth/register
// @desc Register User
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Auth.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({
        errors
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // Default
      });

      const newUser = new Auth({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/auth/login
// @desc Login User / Returning JWT Token
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user email
  Auth.findOne({
    email
  }).then(user => {
    //check for User
    if (!user) {
      errors.email = "User not Found";
      return res.status(404).json(errors);
    }

    //check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = {
          // Creates JWT Payload
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route GET api/auth/current
// @desc Current User
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
