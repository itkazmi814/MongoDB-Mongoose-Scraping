var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},

	link: {
		type: String,
		required: true,
		unique: true
	},

	isSaved: {
		type: Boolean,
		default: false
	},

	// `comments` is an object that stores a Comment id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comments"
		}
	]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
