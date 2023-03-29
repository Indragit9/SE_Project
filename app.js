const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
(LocalStrategy = require("passport-local")),
  (passportLocalMongoose = require("passport-local-mongoose"));
const User = require("./model/User");
const Venue = require("./model/Venue");
const Owner = require("./model/Owner");

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/eventDB");
}

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
  res.render("index");
});

app.get("/view", isLoggedIn, function (req, res) {
  res.render("view");
});

app.get("/view_owner", isLoggedIn, function (req, res) {
  res.render("view_owner");
});

app.get("/addVenue", function (req, res) {
  res.render("addVenue");
});




function capitalize(str){
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2;
};




app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const user = await User.create({
    firstName: capitalize(req.body.fName),
    lastName: capitalize(req.body.lName),
    mobile: capitalize(req.body.cNumber),
    username: capitalize(req.body.email),
    password: capitalize(req.body.password)
  });
  Venue.find({}).then(function(data){           
    res.render("view", { user: user, record: data });
}).catch(function(err){
    console.log(err);
});
});



app.get("/login", function (req, res) {
  res.render("login", { loginPhrase: "Welcome" });
});

// const x = Venue.find({});
app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        Venue.find({}).then(function(data){           
            res.render("view", { user: user, record: data });
        }).catch(function(err){
            console.log(err);
        });
      } else {
        res.render("login", { loginPhrase: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/success", function (req, res) {
  console.log(req.body.name);
});

app.get("/signup_owner", function (req, res) {
  res.render("signup_owner");
});


app.post("/view", function(req, res){
    res.redirect("/view");
});




app.post("/addVenue", async (req, res) => {
    const newVenue = await Venue.create({
    username: capitalize(req.body.place),
    cityName: capitalize(req.body.city),
    stateName: capitalize(req.body.state),
    type: capitalize(req.body.type),
    capacity: capitalize(req.body.capacity),
    price: capitalize(req.body.price)
    });
    newVenue.save();
    res.redirect("/view_owner");
});





app.post("/signup_owner", async (req, res) => {
  const owner = await Owner.create({
    name: capitalize(req.body.oName),
    mNumber: capitalize(req.body.oNumber),
    username: capitalize(req.body.oEmail),
    password: capitalize(req.body.password)
});


  res.render("view_owner", { owner: owner });
});

app.get("/login_owner", function (req, res) {
  res.render("login_owner", { loginPhrase: "Welcome" });
});

app.post("/login_owner", async function (req, res) {
    try {
      // check if the user exists
      const owner = await Owner.findOne({ username: req.body.username });
    //   console.log(owner);
      if (owner) {
        //check if password matches
        const result = req.body.password === owner.password;
        if (result) {
          res.render("view_owner", { owner: owner });
        } else {
          res.render("login_owner", { loginPhrase: "Password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  });



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    console.log("Not Authenticated");
  }
  

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
