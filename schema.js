const Joi = require("joi");
const reviews = require("./models/reviews");
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().min(0).required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        category:Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    reviews:Joi.object({
        rating:Joi.number().min(1).max(5).messages({
            "number.min": "Please select at least 1 star for your rating.",
            "number.max": "Rating cannot exceed 5 stars.",
            "any.required": "A rating is required to submit a review."
        }),
        comment:Joi.string().required(),
    }).required(),
});

module.exports.signUpSchema = Joi.object({
    username: Joi.string().min(3).max(30).trim().required().messages({
        "string.empty":"Username is required",
        "string.min":"Username must be atleast 3 characters long"
    }),

    email:Joi.string()
    .email({minDomainSegments:2 , tlds:{allow:true}})
    .trim()
    .lowercase()
    .message({
        "string.empty":"Email is required",
        "string.email":"Please enter a valid email address."
    }),

    password: Joi.string()
    .min(6)
    .required()
    .messages({
        "string.empty":"Password is required",
        "string.min":"Password must be atleast 6 characters long"
    })

});



