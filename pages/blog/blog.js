import { BlogCard } from './components/blogCard.js';
import { addCollapseFunction } from '../../utils/descriptionSlicer.js';
import { Page } from '../../core/Page.js';
import { DataType } from '../../shared/constants.js';

let BLOG_JSON = 'data/jsons/blog.json';

const default_sorter = 'year';

class Blog extends Page {
	#publicationList = null;

	async #setupPublicationData() {
		if (this.#publicationList !== null) {
			return;
		}

		const pageData = await this.loadPageData(BLOG_JSON, DataType.JSON);
		this.#publicationList = BlogCard.createListFromJson(pageData['posts']);
	}

	async build() {
		await this.buildBody();
		addCollapseFunction();
	}

	async buildBody(search_term = '') {
		await this.#setupPublicationData();
		const sortedPublicationList = BlogCard.sortByProperty(this.#publicationList, default_sorter);

		try {
			if (sortedPublicationList.length > 0) {
				let answerHtml = '';
				for (let i = sortedPublicationList.length - 1; i >= 0; i--) {
					if (sortedPublicationList[i].title.includes(search_term) || search_term == '') {
						answerHtml += sortedPublicationList[i].toHtml();
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
await document.blog.build();

export { Blog };
