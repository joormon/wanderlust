const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async ()=>{

    await listing.deleteMany({});
    initData.data=initData.data.map((Listing)=>({...Listing, category:"Trending",owner:"6a4389e8c30187bde9cdd25f"}));
    await listing.insertMany(initData.data);
    console.log("Data is initialised");
};

initDB();

