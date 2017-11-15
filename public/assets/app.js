console.log("new app.js linked");

//scrape new articles
$("#scrape-btn").on("click", function(event) {
	$.post("/api/articles/scrape", data => {}).then(() => {
		window.location.href = "/";
	});
});

//saves a new article OR unsaves, depending on current status
$(".save-article-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	if ($(this).attr("data-saved") === "true") {
		$.post(`/api/articles/${articleId}/unsave`, data => {
			$(this).html('<i class="fa fa-bookmark-o" aria-hidden="true"></i>');
			$(this).attr("data-saved", "false");
		});
	} else {
		$.post(`/api/articles/${articleId}/save`, data => {
			$(this).html('<i class="fa fa-bookmark" aria-hidden="true"></i>');
			$(this).attr("data-saved", "true");
		});
	}
});

//displays all comments + comment form
$(".view-comments-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
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
	const articleId = $(this).attr("data-article-id");
	const commentBody = $(`#comment-body-${articleId}`).val();
	$.post(`/api/articles/${articleId}/comments/new`, {
		body: commentBody
	}).then(data => {
		console.log("comment data?", data);
		console.log(data.comments);
		console.log(data.comments._id);
		$(`#comment-body-${articleId}`).empty();
		const tempComment = `<div class="card-body p-2">
  			<div data-comment-id={{this._id}} class="d-inline-block delete-comment-btn btn btn-alert"><i class="fa fa-trash-o" aria-hidden="true"></i></div>
  	  		<div class="d-inline-block">
  	  			<h6 class="card-subtitle text-muted ">${commentBody}</h6>
    		</div>
  		</div>`;

		$(`#comment-box-${articleId}`).append(tempComment);
		$(`#form-${articleId}`).slideUp("fast");
	});
});

//deletes a comment
$(".delete-comment-btn").on("click", function(event) {
	const commentId = $(this).attr("data-comment-id");
	$.post(`/api/comments/${commentId}/delete`, data => {}).then(() => {
		$(`#comment-details-${commentId}`).empty();
	});
});
