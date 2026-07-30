if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const ListingsRoute = require("./routes/listing");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");


const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const dns = require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const dbUrl = process.env.MONGO_ATLAS_URL;

main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// 1. Create the store linked to your Atlas DB
const store = MongoStore.create({
    mongoUrl:process.env.MONGO_ATLAS_URL,
    crypto:{
        secret:process.env.SECRET || "mysecretkey"
    },
    touchAfter: 24 * 3600, // Updates session once every 24 hrs if unchanged (saves DB writes)
});

// Optional: Catch errors in the session store
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE:", err);
});

const sessionOptions =  {
    store:store,
    secret:process.env.SECRET ||"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Root directory
app.get("/", (req, res) => {
    res.redirect("/Listings");
});

//Listings route
app.use("/Listings",ListingsRoute);

//Reviews route
app.use("/Listings/:id/reviews",reviewsRoute);

//users route
app.use("/",usersRoute);

// Silence internal Chrome DevTools background requests
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(204).end(); // 204 means "No Content" - satisfies the browser instantly without throwing an error
});

app.get("/favicon.ico", (req, res) => {
    res.status(204).end(); // 204 means "No Content" - satisfies the browser instantly without throwing an error
});
//if no routes found then
// ALTERNATIVE 404: No path string means "Match Everything"
app.use((req, res, next) => {
    console.log("❌ Missing Path requested:", req.originalUrl);
    next(new ExpressError(404, "Page Not Found!!!"));
});

app.use((err, req, res, next) => {
    console.log(err);
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});