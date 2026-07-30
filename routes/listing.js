const express = require("express");
const router = express.Router();
const listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
// const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn,isListOwner,validateListing} = require("../middleware.js");
//Implementing through MVC framework
const listingCollection = require("../collections/listings.js");

const multer  = require("multer")
const storage = require("../cloudConfig.js");
const upload = multer(storage);

router.route("/")
.get(listingCollection.index)
.post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingCollection.newList));

//index route
// router.get("/" ,listingCollection.index);

//new route
router.get("/New",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Create route
// router.post("/", validateListing, wrapAsync(listingCollection.newList));


router.route("/:id").get(wrapAsync(listingCollection.showList))
.put(isLoggedIn,isListOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingCollection.updateList))
.delete(isLoggedIn,isListOwner,wrapAsync(listingCollection.deleteList));

//Show route
// router.get("/:id", validateListing, wrapAsync(listingCollection.showList));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingCollection.editList));

//update route
// router.put("/:id", validateListing,isListOwner, wrapAsync(listingCollection.updateList));


//Delete a list
// router.delete("/:id",isLoggedIn,isListOwner, wrapAsync(listingCollection.deleteList));


module.exports = router;