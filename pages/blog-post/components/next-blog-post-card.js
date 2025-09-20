import { Component } from '../../../core/Component.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';

export class NextBlogPostCard extends Component {
	title;
	date;
	description;
	readingTime;
	linkAddress;

	constructor({ title, date, description, readingTime, linkAddress }) {
		super(NextBlogPostCard.name);
		this.title = title;
		this.date = date;
		this.description = description;
		this.readingTime = readingTime;
		this.linkAddress = linkAddress;
	}

	render() {
		const template = this.loadTemplate();

		template.querySelector('.title').textContent = this.title;
		template.querySelector(
			'.subtitle',
		).textContent = `${this.date} &#9679; ${this.readingTime} minutes to read`;
		template.querySelector('.description').innerHTML = descriptionTrim(this.description);
		template.querySelector('.download-btn').href = `blog-post.html?post=${this.linkAddress}`;

		return template.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').NextBlog[]} data
	 */
	static createListFromJson(data) {
		return data.map(NextBlogPostCard.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').NextBlog} data
	 */
	static createSingleFromJson(data) {
		return new NextBlogPostCard({
			title: data.title,
			date: data.date,
			description: data.description,
			readingTime: data.readingTime,
			linkAddress: data.linkAddress,
		});
	}
}
