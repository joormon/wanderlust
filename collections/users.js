const User = require("../models/user");
const passport = require("passport");

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            email: email,
            username: username
        });

        let regUsr = await User.register(newUser, password);
        req.login(regUsr, (err) => {
            if (err)
                return next(err);
            req.flash("success", `${username} registered successfully`);
            res.redirect("/Listings");
        })


    } catch (err) {
        let errorMsg = err.message;
        req.flash("error", errorMsg);
        res.redirect("/signUp");
    }


}

module.exports.login  =  async (req, res) => {
        // 2. If it reaches this block, authentication was 100% successful!
        req.flash("success", "Welcome back to WanderLust! Glad to have you here.");
        let redirectUrl= res.locals.savedRedirect || "/Listings";
        res.redirect(redirectUrl);

    }

module.exports.logout = (req, res) => {
    // 1. Trigger Passport's logout method
    req.logOut((err) => {
        // 2. If something goes wrong during session destruction, pass the error to Express
        if (err)
            return next(err);

        // 3. Clear session or flash a parting message
        req.flash("success", "You are logged Out!!!");

        // 4. Redirect the user back to a safe public page
        res.redirect("/Listings");
    });


}