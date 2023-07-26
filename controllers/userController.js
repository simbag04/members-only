const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");


exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render('signup');
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
        const errors = validationResult(req);

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            membership: req.body.admin ? "Admin" : "User"
        })
        if (!errors.isEmpty()) {
            console.log("here")
            res.render('signup', { title: "Sign Up", user: user, errs: errors.errors })
        } else {

            await user.save();
            res.redirect('/');
        }
    })
]

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
})