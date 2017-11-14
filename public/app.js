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
		$(`#comments-${articleId}`).slideUp("fast");
		$(`#comments-${articleId}`).attr("data-visible", "no");
	}
});

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
		const tempComment = `<div class="card-block">
  	  <h6 class="card-subtitle mb-2 text-muted">Commenter Name</h6>
    	<p class="card-text">${commentBody}</p>
  	</div>`;
		$(`#comment-box-${articleId}`).append(tempComment);
	});
});
