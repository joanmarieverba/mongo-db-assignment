var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var NewsArticleSchema = new Schema({
    // `headline` is required and of type String
    headline: {
        type: String,
        index: { unique: true },
        required: true
    },
    // `summary` is required and of type String
    summary: {
        type: String,
        required: true
    },
    // `url` is required and of type String
    url: {
        type: String,
        required: true
    },
    // has this article been saved?
    saved: {
        type: Boolean,
        required: true
    },
    //  notes
    note: {
        type: String,
        required: true
    }
});

// This creates our model from the above schema, using mongoose's model method
let NewsArticle = mongoose.model("NewsArticle", NewsArticleSchema);

// Export the Article model
module.exports = NewsArticle;
