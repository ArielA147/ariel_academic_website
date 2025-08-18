import { Page } from '../../core/Page.js';
import { NextBlogPostCard } from '../../js/components/nextBlogPostCard.js';
import { DataType } from '../../shared/constants.js';

let NEXT_BLOG_JSON = 'data/jsons/next_blog.json';

const WORDS_PER_MINUTE_READING = 240;
let this_post_index = 0;

class BlogPost extends Page {
	#postName;

	async build() {
		const searchParams = this.getSearchParams();
		if (searchParams.has('post')) {
			this.#postName = searchParams.get('post');
			this_post_index = this.#postName;
		}

		await this.buildBody();
	}

	async buildBody() {
		const blogPost = await this.loadPageComponent(`pages/blog/blog-post-${this.#postName}.html`);
		if (!blogPost) {
			console.error('Error loading blog post blogPost');
			return;
		}

		this.#setPostContent(blogPost);
		await this.#setNextBlogContent();
	}

	#setPostContent(blogPost) {
		const paperElements = blogPost.split('<hr class="publications-hr">');
		const readingTime = Math.round(paperElements[2].split(' ').length / WORDS_PER_MINUTE_READING);

		document.getElementById('title').innerHTML =
			paperElements[0] +
			"<div class='meta-blog-post-title'>" +
			paperElements[1] +
			' &#9679; ' +
			readingTime +
			' minutes to read </div>';
		document.getElementById('content').innerHTML = paperElements[2];
	}

	async #setNextBlogContent() {
		const nextBlogPost = await this.loadPageData(NEXT_BLOG_JSON, DataType.JSON);

		try {
			const nextBlogsList = NextBlogPostCard.createListFromJson(nextBlogPost[this_post_index]);
			if (nextBlogsList.length > 0) {
				let answerHtml = '';
				for (var elementIndex = nextBlogsList.length - 1; elementIndex >= 0; elementIndex--) {
					answerHtml += nextBlogsList[elementIndex].toHtml();
				}
				document.getElementById('next_papers').innerHTML = answerHtml;
			} else {
				document.getElementById('next_read_all').style.display = 'none';
			}
		} catch (error) {
			document.getElementById('next_read_all').style.display = 'none';
		}
	}
}

document.blogPost = new BlogPost();
await document.blogPost.build();

export { BlogPost };
