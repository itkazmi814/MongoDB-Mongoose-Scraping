module.exports = function(app, axios, cheerio, db) {
	console.log("Imported api routes");

	//GET route - scrapes reddit.com/r/popular
	app.post("/api/articles/scrape", (req, res) => {
		var counter = 0;
		//grab the html body of the request using saxios
		axios
			.get("https://www.reddit.com/r/popular/")
			.then(response => {
				//load response into cheerio
				var $ = cheerio.load(response.data);
				//grab the specific data we are looking for
				$("#siteTable p.title").each((i, element) => {
					var article = {};
					article.title = $(element)
						.children("a")
						.text();

					article.link = $(element)
						.children("a")
						.attr("href");

					db.Article.create(article);
				});
			})
			.then(() => {
				res.redirect("/api/articles");
			})
			.catch(error => console.log(error));
	});

	app.get("/", (req, res) => {
		res.redirect("/api/articles");
	});

	//GET route - gets all articles from db
	app.get("/api/articles", (req, res) => {
		db.Article
			.find({})
			.populate("comments")
			.sort({ _id: -1 })
			.then(allArticles => {
				res.render("index", allArticles);
			});
	});

	//GET route - gets all saved articles from db
	app.get("/api/articles/saved", (req, res) => {
		db.Article
			.find({ isSaved: true })
			.populate("comments")
			.sort({ _id: -1 })
			.then(allSaved => {
				res.render("index", allSaved);
			});
	});

	//POST route - save a specific article
	app.post("/api/articles/:id/save", (req, res) => {
		db.Article
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: { isSaved: true } },
				{ new: true }
			)
			.then(data => {
				res.json(data);
			});
	});

	//UPDATE route - unsave an article
	app.post("/api/articles/:id/unsave", (req, res) => {
		db.Article
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: { isSaved: false } },
				{ new: true }
			)
			.then(data => {
				res.json(data);
			});
	});

	//GET route - display a specific article's comments
	app.get("/api/articles/:id", (req, res) => {
		db.Article
			.findOne({
				_id: req.params.id
			})
			.populate("comments")
			.then(fullArticleInfo => {
				res.json(fullArticleInfo);
			});
	});

	//POST route - add new comment to an article
	app.post("/api/articles/:id/comments/new", (req, res) => {
		db.Comments
			.create(req.body)
			.then(newComment => {
				return db.Article.findOneAndUpdate(
					{ _id: req.params.id },
					{ $push: { comments: newComment._id } },
					{ new: true }
				);
			})
			.then(data => {
				res.json(data);
			});
	});

	//POST route - delete a comment on an article
	app.post("/api/comments/:id/delete", (req, res) => {
		db.Comments.remove({ _id: req.params.id }).then(() => {
			db.Article
				.update(
					{ comments: req.params.id },
					//removes a specific index of the comments array where id matches
					{ $pullAll: { comments: [{ _id: req.params.id }] } }
				)
				//UN NEST THIS SHIT
				.then(data => {
					res.json(data);
				});
		});
	});
};
