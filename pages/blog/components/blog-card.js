import { Component } from '../../../core/Component.js';

export class BlogCard extends Component {
	title;
	description;
	year;
	month;
	day;
	/** @type {import('../../../constants/types.js').FileLink[]} */
	fileLinks;
	order;

	constructor({ title, description, year, month, day, fileLinks, order }) {
		super(BlogCard.name);
		this.title = title;
		this.description = description;
		this.year = year;
		this.month = month;
		this.day = day;
		this.fileLinks = fileLinks;
		this.order = order;
	}

	render() {
		const template = this.loadTemplate();

		template.querySelector('.blog-title').textContent = this.title;
		template.querySelector('.description').textContent = this.description;
		template.querySelector('.blog-data').textContent = `${this.day}/${this.month}/${this.year}`;
		template.querySelector('.download-btn').href = `blog-post.html?post=${this.fileLinks[0].link}`;

		return template.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').Blog[]} data
	 */
	static createListFromJson(data) {
		return data.map(BlogCard.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').Blog} data
	 */
	static createSingleFromJson(data) {
		return new BlogCard({
			title: data.title,
			description: data.description,
			year: data.year,
			month: data.month,
			day: data.day,
			fileLinks: data.fileLinks,
			order: data.order,
		});
	}
}
