const listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig.js");

module.exports.index = async (req, res) => {

    let { category, search } = req.query;
    console.log(category);
    console.log(`The user searched for ${search}`)
    let filterQuery = {};

    // If a specific category was requested, apply it directly to the MongoDB finder filter
    if (category) {
        filterQuery.category = category;
    }

    // 2. If a search query was typed, apply the regex search parameters
    if (search) {
        filterQuery.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    // Executes atomic queries using dynamically resolved conditions
    const allListings = await listing.find(filterQuery);

    if (allListings.length === 0 && (category || search)) {
        if (category && search)
            req.flash("error", `No listings available in the "${category}" category and with this ${search} search`);
        else if (category)
            req.flash("error", `No listings available in the ${category} category`);
        else if (search)
            req.flash("error", `No listings found based on the ${search}`);

        return res.redirect("/listings"); // Redirect back to clear the filter
    }

    res.render("listings/index.ejs", { list: allListings, activeCategory: category });

}


module.exports.newList = async (req, res, next) => {

    let url = req.file.url;
    let filename = req.file.public_id;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = url;
    newListing.image.filename = filename;
    console.log(req.body.listing);
    await newListing.save();
    req.flash("success", "New List added successfully");
    res.redirect("/Listings");
}

module.exports.showList = async (req, res) => {
    let { id } = req.params;
    const specificList = await listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");

    if (!specificList) {
        req.flash("error", "List not available");
        res.redirect("/Listings");
    }
    else {
        console.log(specificList);
        res.render("listings/show.ejs", { list: specificList });
    }

}

module.exports.editList = async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "List not available for updating");
        res.redirect("/Listings");
    }

    originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
    res.render("listings/edit.ejs", { list, originalImageUrl });
}

module.exports.updateList = async (req, res) => {
    let { id } = req.params;
    let list = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.url;
        let filename = req.file.public_id;
        list.image = { url, filename };
        await list.save();
    }
    req.flash("success", "List updated successfully");
    res.redirect(`/Listings/${id}`);
}


module.exports.deleteList = async (req, res) => {
    let { id } = req.params;
    // This automatically triggers the "findOneAndDelete" hook in your schema!
    // 1. Find the listing to get its image filename
    let deletedListing = await listing.findByIdAndDelete(id);

    // 2. If an image filename exists, delete it from Cloudinary
    if (deletedListing && deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}