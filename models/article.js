var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var NewsArticleSchema = new Schema({
    // `headline` is required and of type String
    headline: {
        type: String,
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
    //`note` is an object that stores a Note id
    //The ref property links the ObjectId to the Note model
    //This allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "NewsNote"
    }
});

// This creates our model from the above schema, using mongoose's model method
let NewsArticle = mongoose.model("NewsArticle", NewsArticleSchema);

// Export the Article model
module.exports = NewsArticle;
