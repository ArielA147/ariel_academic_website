import { Component } from '../../../core/Component.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';

export class Resource extends Component {
	title;
	description;
	recommendation;
	/**
	 * @type {import('../../../constants/types.js').FileLink[]}
	 */
	fileLinks;
	authors;
	year;
	topic;
	type;

	constructor({ title, description, recommendation, fileLinks, authors, year, topic, type }) {
		super(Resource.name);
		this.title = title;
		this.description = description;
		this.recommendation = recommendation;
		this.fileLinks = fileLinks;
		this.authors = authors;
		this.year = year;
		this.topic = topic;
		this.type = type;
	}

	render() {
		const resource = this.loadTemplate();

		resource.querySelector('.title').textContent = this.title;

		if (this.fileLinks[0]?.link) {
			resource.querySelector('.cite-btn').addEventListener('click', async () => {
				await this.copyCitation(this.title);
			});
		} else {
			resource.querySelector('.cite-btn').remove();
		}

		if (this.authors) {
			resource.querySelector('.authors').textContent = this.authors;
		} else {
			resource.querySelector('.authors').remove();
		}

		if (this.description) {
			resource.querySelector('.card-description-resource').textContent = this.description;
		} else {
			resource.querySelector('.card-description-resource').remove();
		}

		if (this.recommendation) {
			resource.querySelector('.recommend-promo').innerHTML = descriptionTrim(
				`Why am i recommending this? ${this.recommendation}`,
			);
		} else {
			resource.querySelector('.recommend-promo').remove();
		}

		const links = resource.querySelector('.links');
		if (this.fileLinks?.length) {
			this.fileLinks.forEach((fileLink) => {
				const link = document.createElement('a');
				link.href = fileLink.link;
				link.className = `download-btn acadmic-card-margin-fix ${fileLink.info}`;

				links.appendChild(link);
			});
		} else {
			resource.querySelector('.links').remove();
		}

		resource.querySelector('.year').textContent = this.year;
		resource.querySelector('.type').textContent = this.type;

		return resource.firstElementChild;
	}

	/**
	 * @param {string} title
	 */
	async copyCitation(title) {
		const parsedTitle = title.replaceAll("'", '').replaceAll(' ', '_');
		try {
			await navigator.clipboard.writeText(parsedTitle);

			document.getElementById('cite-alert').innerHTML = `Copied ${parsedTitle}`;
			const alertDiv = document.getElementById('alert-close-btn').parentElement;
			alertDiv.style.opacity = '1';
			alertDiv.style.zIndex = '2';
			alertDiv.style.visibility = 'visible';
			setTimeout(() => {
				alertDiv.style.opacity = '0';
				alertDiv.style.zIndex = '-1';
				alertDiv.style.visibility = 'hidden';
			}, 2500);
		} catch (error) {
			console.error('Could not copy citation: ', error);
		}
	}

	/**
	 * @param {import('../../../constants/types.js').Resource[]} data
	 */
	static createListFromJson(data) {
		return data.map(Resource.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').Resource} data
	 */
	static createSingleFromJson(data) {
		return new Resource({
			title: data.title,
			description: data.description,
			recommendation: data.recommendation,
			fileLinks: data.fileLinks,
			authors: data.authors,
			year: data.year,
			topic: data.topic,
			type: data.type,
		});
	}
}
