const listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.newReview = async (req, res) => {
    let { id } = req.params;
    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;

    const list = await listing.findById(id);
    list.reviews.push(newReview._id);

    await newReview.save();
    await list.save();

    // console.log(list);
    res.redirect(`/Listings/${id}`);
};


module.exports.deleteReview = async (req, res) => {

    let { id, reviewid } = req.params;
    let delRev = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    // console.log(delRev);
    res.redirect(`/Listings/${id}`);
};