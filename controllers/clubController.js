const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
require('dotenv').config();

exports.join_club_get = asyncHandler(async (req, res, next) => {
    res.render('joinclub', { title: "Join Club" })
})

exports.join_club_post = [
    body("passcode", "Please enter a passcode")
        .trim()
        .isLength({min: 1})
        .escape()
        .custom(async(value, {req}) => {
            if (value != process.env.MEMBER_PASSWORD) {
                console.log(process.env.MEMBER_PASSWORD)
                throw new Error("Incorrect Passcode")
            }
            return true;
        }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('joinclub', { title: "Join Club", 
                                    value: req.body.passcode, 
                                    errors: errors.errors})
        } else {
            const user = await User.findOne({ email: res.locals.currentUser.email });
            user.member = true;
            await User.findByIdAndUpdate(user._id, user, {})
            console.log(user);
            res.redirect('/')
        }
    })
]