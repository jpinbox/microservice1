const express = require('express');
const app = express();
const UserRoute = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const passport = require('passport');

// Require Post model in our routes module
let User = require('../models/User');
const privateKEY  = fs.readFileSync('server/private.key', 'utf8');
const publicKEY  = fs.readFileSync('server/public.key', 'utf8');

// Defined store route
UserRoute.route('/register').post(function (req, res) {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if(user) {
        return res.status(400).json({
            email: 'Email already exists'
        });
    }
    else {
        const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const newUser = new User({
            displayName: req.body.displayName,
            email: req.body.email,
            password: req.body.password,
            avatar
        });
        
        bcrypt.genSalt(10, (err, salt) => {
            if(err) console.error('There was an error', err);
            else {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) console.error('There was an error', err);
                    else {
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.json(user)
                            }); 
                    }
                });
            }
        });
    }
});
});

// Defined get data(index or listing) route
UserRoute.route('/users').get(function (req, res) {
  console.log(req.query);
  User.find(req.query, function (err, users) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(users);
    }
  });
});

// Defined get data(index or listing) route
UserRoute.route('/login').post(function (req, res) {
  console.log("req.body = " + req.body.email);
  console.log("req.body.password = " + req.body.password);
 // let user = new User(req.body.data);
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                displayName: user.displayName,
                                avatar: user.avatar,
                                role: user.role,
                                orgId: user.orgId
                            }
                            jwt.sign(payload, privateKEY, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`,
                                        //token,
                                        user: payload
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});

// Defined get data(index or listing) route
UserRoute.route('/user/update/:id').post(function (req, res) {
  User.findById({ _id: req.params.id }, function (err, user) {
    if (err) {
      console.log(err);
    }
    else {
      user.name = req.body.name;
      user.description = req.body.description;
      user.userType = req.body.userType;
      user.participants = req.body.participants;
      user.save(function (err) {
        if (err)
          res.send(err);
        else
          res.json(user);
      });

    }
  });
});

// Defined delete | remove | destroy route
UserRoute.route('/user/delete/:id').get(function (req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.json(err);
    else res.json(req.params.id);
  });
});

module.exports = UserRoute;