const listing = require("./models/listing");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const {signUpSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn =(req,res,next)=>{
    
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in!!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    res.locals.savedRedirect = req.session.redirectUrl;
    next();
};

module.exports.isListOwner=async (req,res,next)=>{
    let { id } = req.params;
    let list = await listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not permitted to edit the page");
        return res.redirect(`/Listings/${id}`);
    };
    next(); 
};

module.exports. validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
         let errMsg = error.details.map((el) => el.message).join(",");
        // 1. Flash the error message
        req.flash("error", errMsg);
        
        // 2. Extract the listing ID from request params
        let { id } = req.params;
        
        // 3. Redirect directly back to the show page!
        return res.redirect(`/listings/${id}`);
    }
    else {
        next();
    }

};


module.exports.validateSignUp = (req,res,next)=>{

    const {error} = signUpSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");

        req.flash("error",errMsg);
        return res.redirect("/signUp");
    }else{
        next();
    }
};
