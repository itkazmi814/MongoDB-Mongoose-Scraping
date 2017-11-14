console.log("app.js linked");

$(".save-article-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	console.log("Saving article", articleId);
	$.post(`/api/articles/${articleId}/save`, data => {
		console.log(`Article now saved`);
		console.log(data);
	});
});

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
		$(`#form-${articleId}`).slideUp("fast");
		$(`#comments-${articleId}`).slideUp("fast");
		$(`#comments-${articleId}`).attr("data-visible", "no");
		$(`#form-${articleId}`).attr("data-visible", "no");
	}
});

$(".create-comment-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	console.log(articleId);
	console.log($(`#form-${articleId}`));
	console.log($(`#form-${articleId}`).attr("data-visible"));
	//Hide the Add Comment button and display the new comment form
	if ($(`#form-${articleId}`).attr("data-visible") === "no") {
		$(`#create-comment-${articleId}`).slideUp("fast");
		$(`#form-${articleId}`).slideDown("fast");
		$(`#form-${articleId}`).attr("data-visible", "yes");
	}
});
