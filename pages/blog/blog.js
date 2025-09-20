// import { BlogCard } from './components/blogCard.js';
import { BlogCard } from './components/blog-card.js';
import { addCollapseFunction } from '../../utils/descriptionSlicer.js';
import { Page } from '../../core/Page.js';
import { JSON_FILE_PATHS, DataType } from '../../constants/data.js';
import { sortItemsByKey } from '../../services/data-manipulator.js';
import { TEMPLATES_LOADED_EVENT } from '../../constants/events.js';

const default_sorter = 'year';

class Blog extends Page {
	/** @type {import('./components/blog-card.js').BlogCard[]} */
	#publicationList;

	async #setupPublicationData() {
		if (this.#publicationList) {
			return;
		}

		const pageData = await this.loadPageData(JSON_FILE_PATHS.BLOG_JSON, DataType.JSON);
		this.#publicationList = BlogCard.createListFromJson(pageData['posts']);
	}

	async build() {
		await this.buildBody();
		addCollapseFunction();
	}

	async buildBody(search_term = '') {
		await this.#setupPublicationData();
		/** @type {import('./components/blog-card.js').BlogCard[]} */
		const sortedPublicationList = sortItemsByKey(this.#publicationList, default_sorter);

		try {
			if (sortedPublicationList.length > 0) {
				let answerHtml = '';
				for (let i = sortedPublicationList.length - 1; i >= 0; i--) {
					if (sortedPublicationList[i].title.includes(search_term) || search_term == '') {
						answerHtml += sortedPublicationList[i].render().outerHTML;
					}
				}
				document.getElementById('publications-body').innerHTML = answerHtml;
			} // show error message
			else {
				document.getElementById('publications-body').innerHTML =
					"<h3>Don't have blog posts with this filter</h3>"; // should not happen
			}
		} catch (error) {
			console.log('Error at Blog.buildBody saying: ' + error);
		}
	}

	// TODO: is this even used?
	search() {
		this.buildBody(document.getElementById('').value.trim().toLowerCase());
	}
}

document.blog = new Blog();
document.addEventListener(TEMPLATES_LOADED_EVENT, async () => {
	await document.blog.build();
});

export { Blog };
