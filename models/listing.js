const mongoose = require("mongoose");
const Reviews = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },
        image: {
            url:String,
            filename:String
        },
        price: {
            type: Number
        },
        location: {
            type: String
        },
        country: {
            type: String
        },
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        category:{
            type:String,
            required:true,
            enum:["Trending","Mountains", "Castles", "Pool", "Beach", "Gym"],
            default:"Trending"
        }

    }
);

listingSchema.post("findOneAndDelete",async (deletedList)=>{

    if(deletedList)
    {
        console.log("Deleting the List and its Linked Reviews are being deleted...");
        await Reviews.deleteMany({ _id: { $in: deletedList.reviews } });
        console.log("Successfully List and its linked reviews are deleted");
    }

});


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;