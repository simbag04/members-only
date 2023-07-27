const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs")

exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render('signup', { title: "Sign up" });
})

exports.sign_up_post = [
    // validate fields
    body("first_name", "First Name cannot be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("last_name", "Last Name cannot be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("email", "Email cannot be empty")
        .trim()
        .isLength({min: 1})
        .escape()
        .custom(async(value, {req}) => {
            const docs = await User.countDocuments({email: value});
            if (docs > 0) {
                throw new Error("User already exists!");
            }
            return true;
        }),
    body("password", "Password must be at least 6 characters")
        .trim()
        .isLength({min: 6})
        .escape(), 
    body("confirm_password", "Password must be at least 6 characters")
        .trim()
        .isLength({min: 6})
        .escape()
        .custom(async(value, {req}) => {
            if (value != req.body.password) throw new Error("Passwords must match")
            return true;
        }),

    asyncHandler(async (req, res, next) => {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
              return next(err);
            } else {
                const errors = validationResult(req);

                const user = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: hashedPassword
                })

                if (!errors.isEmpty()) {
                    user.password = req.body.password;
                    res.render('signup', { title: 'Sign Up', user: user, errs: errors.errors })
                } else {
                    await user.save();
                    res.redirect('/');
                }
            }
        });

    })
]

exports.log_in_get = asyncHandler(async (req, res, next) => {
    res.render('login', { title: "Log in" });
})

exports.log_in_post = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          return res.render('login', { title: "Log in", message: info.message })
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      })(req, res, next);
}   

exports.log_out = (function(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});