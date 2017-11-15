console.log("app.js linked");

//scrape new articles
$("#scrape-btn").on("click", function(event) {
	console.log("Scraping new articles");
	$.post("/api/articles/scrape", data => {
		console.log("Scraped new articles");
	}).then(() => {
		window.location.href = "/";
	});
});

$("#saved-articles-btn").on("click", function(event) {
	console.log("Going to saved articles");
	// window.location.href = "/api/articles/saved";
});

//saves a new article OR unsaves, depending on current status
$(".save-article-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	console.log($(this).attr("data-saved"));
	if ($(this).attr("data-saved") === "true") {
		console.log("Unsaving article", articleId);
		$.post(`/api/articles/${articleId}/unsave`, data => {
			console.log("Article unsaved");
			console.log(data);
			// $(this).removeClass("fa-bookmark");
			// $(this).addClass("fa-bookmark-o");
			$(this).html('<i class="fa fa-bookmark-o" aria-hidden="true"></i>');
			$(this).attr("data-saved", "false");
		});
	} else {
		console.log("Saving article", articleId);
		$.post(`/api/articles/${articleId}/save`, data => {
			console.log("Article now saved");
			console.log(data);
			$(this).html('<i class="fa fa-bookmark" aria-hidden="true"></i>');
			$(this).attr("data-saved", "true");
		});
	}
});

//displays all comments + comment form
$(".view-comments-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	console.log(articleId);
	console.log($(`#comments-${articleId}`));
	console.log($(`#comments-${articleId}`).attr("data-visible"));
	//If the comments are not displayed, make them visible
	if ($(`#comments-${articleId}`).attr("data-visible") === "no") {
		$(`#create-comment-${articleId}`).show();
		$(`#comments-${articleId}`).slideDown("fast");
		$(`#comments-${articleId}`).attr("data-visible", "yes");
		//If comment are displayed, hide them and the create comment form
	} else {
		$(`#comments-${articleId}`).slideUp("fast");
		$(`#comments-${articleId}`).attr("data-visible", "no");
	}
});

//adds new comment
$(".submit-comment-btn").on("click", function(event) {
	event.preventDefault();
	console.log("Submit comment button pressed");
	const articleId = $(this).attr("data-article-id");
	console.log(articleId);

	const commentBody = $(`#comment-body-${articleId}`).val();
	console.log(commentBody);

	$.post(
		`/api/articles/${articleId}/comments/new`,
		{ body: commentBody },
		data => {
			console.log("Comment added");
			console.log(data);
		}
	).then(() => {
		$(`#comment-body-${articleId}`).empty();
		const tempComment = `<div id="comment-details-{{this._id}}"class="card-block">
  			<div data-comment-id={{this._id}} class="d-inline-block delete-comment-btn btn btn-alert"><i class="fa fa-trash-o" aria-hidden="true"></i></div>
  	  		<div class="d-inline-block">
  	  			<h6 class="card-subtitle my-3 text-muted ">${commentBody}</h6>
    		</div>
  		</div>`;

		$(`#comment-box-${articleId}`).append(tempComment);
		$(`#form-${articleId}`).slideUp("fast");
	});
});

//deletes a comment
$(".delete-comment-btn").on("click", function(event) {
	const commentId = $(this).attr("data-comment-id");
	console.log("Deleting comment", commentId);
	$.post(`/api/comments/${commentId}/delete`, data => {
		console.log(`Comment deleted`);
	}).then(() => {
		$(`#comment-details-${commentId}`).remove();
	});
});
