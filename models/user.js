const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        lowercase: true,
        trim:true
    }
});

//Instead of writing all the complex hashing, salting, and authentication logic manually,
// the plugin injects it directly into the schema's pipeline.
//Specifically, it automatically adds:
//New Fields to your Schema: It adds a username, a hash (for the encrypted password), and a salt (for password security)
//directly into your database schema definition. You don't even have to type them out in your code!

// ✅ FIX: Force Mongoose to see the function inside the object if it's wrapped
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose,{
    // Custom specific error messages
    incorrectPasswordError: 'Incorrect password. Please try again.',
    incorrectUsernameError: 'Username does not exist.'
}
);
module.exports = mongoose.model("User", userSchema);