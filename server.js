const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

// Require all models
const db = require("./models");
//console.log("db ", db);
const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
//Connect Handlebars to express app
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


// Connect to the Mongo DB
mongoose.Promise=Promise;
mongoose.connect(MONGODB_URI);

// Routes


// Main route (show handlebars front end)
app.get("/", function (req, res) {
    db.NewsArticle.find({})
        .then(function (dbNewsArticle) {
            // If we were able to successfully find Articles, display them
//            res.json(dbNewsArticle);
            res.render("index", dbNewsArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
 //   res.render("index");
});

// A GET route for scraping the website
app.get("/scrape", function (req, res) {

    // First, we grab the body of the html with request
    request("https://medium.com/topic/technology", (error, response, html) => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(html);
        const results = [];
        const target = "div.u-flexColumnTop.u-flexWrap.u-overflowHidden.u-absolute0.u-xs-relative";

        $(target).each((i, element) => {
            const url = $(element)
            .children()
            .children()
            .attr("href");
            const headline = $(element)
            .children()
            .children()
            .children()
            .text();
            const summary = $(element)
            .children("a") //children with the element tag "a"
            .children()
            .text();

            //push only if all 3 items found
            if (headline && url && summary) {
                results.push({
                headline: headline,
                url: url,
                summary: summary,
                //set default values
                saved: false,
                note: " "
                });
            }
        });

        for (let i=0; i<results.length; i++){
            db.NewsArticle.create(results[i])
            .then (function(data) {
            })
            .catch (function (err) {
            // If an error occurred, send it to the client
                return res.json(err);
            });
        };
        res.send("Scrape complete!");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.NewsArticle.find({})
        .then(function (dbNewsArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbNewsArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Save Article: change the value of saved
app.post("/saved/:id", function (req, res) {
    
    //need callback function in order for this to work
    db.NewsArticle.findByIdAndUpdate(req.params.id, {$set : { saved: true }}, { new: true }, function (error, obj){
        if (error ) next (error);
    });

});

// Delete Article: change the value of saved
app.post("/delete/:id", function (req, res) {

    //need callback function in order for this to work
    db.NewsArticle.findByIdAndUpdate(req.params.id, { $set: { saved: false } }, { new: true }, function (error, obj) {
        if (error) next(error);
    });

});


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
        console.log("req.body ", req.body);
    console.log("req.params.id ", req.params.id);
    //need callback function in order for this to work
    db.NewsArticle.findByIdAndUpdate(req.params.id, { $set: { note: req.body.note } }, { new: true }, function (error, obj) {
        if (error) next(error);
    });

});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
