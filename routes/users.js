const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const {saveRedirectUrl , validateSignUp} = require("../middleware");
const userCollection = require("../collections/users");

router.get("/signUp", (req, res) => {
    res.render("users/signup");
});

//POST
router.post("/signUp",validateSignUp,wrapAsync( userCollection.signUp));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login",
    saveRedirectUrl,
    // 1. Passport Middleware handles authentication automatically
    passport.authenticate("local", {
        failureRedirect: "/login",// Where to redirect if login fails
        failureFlash: true,// Automatically flash the error message from passport
    }), userCollection.login);

router.get("/logout", userCollection.logout)

module.exports = router;
