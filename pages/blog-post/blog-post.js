import { Page } from '../../core/Page.js';
import { NextBlogPostCard } from './components/next-blog-post-card.js';
import { getQueryParams } from '../../services/url.js';
import { JSON_FILE_PATHS, DataType } from '../../constants/data.js';

const WORDS_PER_MINUTE_READING = 240;
let this_post_index = 0;

class BlogPost extends Page {
	#postName;

	async build() {
		const queryParams = getQueryParams();
		if (queryParams.has('post')) {
			this.#postName = queryParams.get('post');
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
		const nextBlogPost = await this.loadPageData(JSON_FILE_PATHS.NEXT_BLOG_JSON, DataType.JSON);

		try {
			const nextBlogsList = NextBlogPostCard.createListFromJson(nextBlogPost[this_post_index]);
			if (nextBlogsList.length > 0) {
				let answerHtml = '';
				for (var elementIndex = nextBlogsList.length - 1; elementIndex >= 0; elementIndex--) {
					answerHtml += nextBlogsList[elementIndex].render().outerHTML;
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
