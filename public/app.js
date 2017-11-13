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
	console.log(this);
	$(this).show();
	$(`#${articleId}`).removeClass("hidden-xs-up");
	console.log(this);
});
