import { Component } from '../../../core/Component.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';

export class ProjectPanel extends Component {
	title;
	description;
	/** @type {import('../../../constants/types.js').FileLink} */
	fileLink;
	// TODO: change this to fileLinks

	constructor({ title, description, fileLink }) {
		super(ProjectPanel.name);
		this.title = title;
		this.description = description;
		this.fileLink = fileLink;
	}

	render() {
		const projectPanel = this.loadTemplate();

		projectPanel.querySelector('.title').textContent = this.title;
		projectPanel.querySelector('.description').innerHTML = descriptionTrim(this.description);

		if (this.fileLink.link) {
			const actionButton = projectPanel.querySelector('.download-fileLink');
			actionButton.href = this.fileLink.link;
			actionButton.textContent = this.fileLink.info;
		} else {
			projectPanel.querySelector('.card-footer').remove();
		}

		return projectPanel.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').Project[]} data
	 */
	static createListFromJson(data) {
		return data.map(ProjectPanel.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').Project} data
	 */
	static createSingleFromJson(data) {
		return new ProjectPanel({
			title: data.title,
			description: data.description,
			fileLink: data.fileLink,
		});
	}
}
