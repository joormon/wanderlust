const express = require("express");
const router = express.Router({mergeParams:true});
const listing = require("../models/listing");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
// const { reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const reviewCollection = require("../collections/reviews.js");
const {validateReview} = require("../middleware.js");


//Reviews
//new route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewCollection.newReview));

//Review Delete route
router.delete("/:reviewid", wrapAsync(reviewCollection.deleteReview));


module.exports = router;
