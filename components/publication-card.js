import { Component } from '../core/Component.js';
import { isFileFormat } from '../services/files.js';
import { descriptionTrim } from '../utils/descriptionSlicer.js';

export class PublicationCard extends Component {
	title;
	description;
	/** @type {import('../constants/types.js').FileLink[]} */
	fileLinks;
	authors;
	year;
	topic; // TODO: not in use
	type;
	publisher;
	publicationStatus;

	/**
	 *
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.description
	 * @param {import('../constants/types.js').FileLink[]} params.fileLinks
	 * @param {string} params.authors
	 * @param {number} params.year
	 * @param {string} params.topic // TODO: make this an enum
	 * @param {string} params.type
	 * @param {string} params.publisher
	 * @param {string} params.publicationStatus
	 */
	constructor({
		title,
		description,
		fileLinks,
		authors,
		year,
		topic,
		type,
		publisher,
		publicationStatus,
	}) {
		super(PublicationCard.name);
		this.title = title;
		this.description = description;
		this.fileLinks = fileLinks;
		this.authors = authors;
		this.year = year;
		this.topic = topic;
		this.type = type;
		this.publisher = publisher;
		this.publicationStatus = publicationStatus;
	}

	render() {
		const publicationCard = this.loadTemplate('publication-card');

		publicationCard.querySelector('.title').textContent = this.title;

		if (this.fileLinks?.[1]?.link) {
			publicationCard.querySelector('.cite-btn').addEventListener('click', async () => {
				await this.copyCitation(this.title);
			});
		} else {
			publicationCard.querySelector('.cite-btn').remove();
		}

		publicationCard.querySelector('.authors').textContent = this.authors;
		publicationCard.querySelector('.publisher').textContent = this.publisher;
		publicationCard.querySelector('.description').innerHTML = descriptionTrim(this.description);
		publicationCard.querySelector('.status').textContent = this.publicationStatus;
		publicationCard.querySelector('.year').textContent = this.year;
		publicationCard.querySelector('.type').textContent = this.type;

		if (this.fileLinks?.[0]?.link && isFileFormat(this.fileLinks[0].link)) {
			publicationCard.querySelector('.download-btn').setAttribute('href', this.fileLinks[0].link);
			publicationCard
				.querySelector('.read-online-btn')
				.setAttribute('href', this.fileLinks[0].link);
		} else {
			publicationCard.querySelector('.inner-publication-card-div').remove();
		}

		return publicationCard.firstElementChild;
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
	 *
	 * @param {import('../constants/types.js').AcademicPublication[]} data
	 */
	static createListFromJson(data) {
		return data.map(PublicationCard.createSingleFromJson);
	}

	/**
	 * @param {import('../constants/types.js').AcademicPublication} data
	 */
	static createSingleFromJson(data) {
		return new PublicationCard({
			title: data.title,
			description: data.description,
			fileLinks: data.fileLinks,
			authors: data.authors,
			year: Number(data.year),
			// topic: data.topic,
			type: data.type,
			publisher: data.publisher,
			publicationStatus: data.publicationStatus,
		});
	}
}
