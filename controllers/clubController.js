const User = require('../models/user')
const Message = require('../models/message')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
require('dotenv').config();

exports.index = asyncHandler(async (req, res, next) => {
    // get all messages
    const messages = await Message.find().populate("created_by").exec();
    res.render('index', { title: "Members Only", 
                            user: res.locals.currentUser,
                            messages: messages})
})

exports.join_club_get = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) {
        const err = new Error("You must be logged in to join the club!");
        err.status = 404;
        return next(err);
    }
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

exports.become_admin_get = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) {
        const err = new Error("You must be logged in to become an admin!");
        err.status = 404;
        return next(err);
    }
    res.render('becomeadmin', { title: "Become Admin" })
})

exports.become_admin_post = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: res.locals.currentUser.email });
    user.admin = true;
    await User.findByIdAndUpdate(user._id, user, {})
    res.redirect('/')
})

exports.create_message_get = asyncHandler(async(req, res, next) => {
    res.render('createmessage', { title: "Create Message" })
})

exports.create_message_post = [
    body("title", "Please enter a title")
        .trim()
        .isLength({ min: 1 }),
    body("message", "Please enter a message")
        .trim()
        .isLength({min: 1}),   
        
    asyncHandler(async(req, res, next) => {
        if (!res.locals.currentUser) {
            const err = new Error("You must be logged in to create a message!");
            err.status = 404;
            return next(err);
        }

        const errors = validationResult(req);
        const message = new Message({
            title: req.body.title,
            message: req.body.message,
            created_by: res.locals.currentUser._id
        })

        if (!errors.isEmpty()) {
            res.render('createmessage', { title: "Create Message", 
                                        message: message, 
                                        errors: errors.errors})
        } else {
            await message.save();
            res.redirect('/')
        }
    })
]

exports.delete_message_get = asyncHandler(async(req, res, next) => {
    const message = await Message.findById(req.params.id).populate("created_by");
    if (message == null) {
        const err = new Error("Message not found");
        err.status = 404;
        return next(err);
    }
    res.render('deletemessage', { title: "Delete Message", 
                                    user: res.locals.currentUser, 
                                    msg: message})
})

exports.delete_message_post = asyncHandler(async(req, res, next) => {
    await Message.findByIdAndRemove(req.params.id).exec();
    res.redirect('/')
})