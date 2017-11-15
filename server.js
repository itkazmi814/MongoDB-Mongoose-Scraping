var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

var db = require("./models");
var port = process.env.PORT || 3000;
var MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static(path.join(__dirname, "public")));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes
require("./routes/api-routes")(app, axios, cheerio, db);

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/redditScraper", {
	useMongoClient: true
});

// Start the server
app.listen(port, function() {
	console.log("App running on port " + port + "!");
});
