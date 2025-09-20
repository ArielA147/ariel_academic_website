import { Component } from '../../../core/Component.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';

export class ProjectSection extends Component {
	title;
	description;
	/** @type {import('../../../constants/types.js').FileLink} */
	fileLink;

	constructor({ title, description, fileLink }) {
		super(ProjectSection.name);
		this.title = title;
		this.description = description;
		this.fileLink = fileLink;
	}

	render() {
		const projectSection = this.loadTemplate();

		projectSection.querySelector('.title').textContent = this.title;
		projectSection.querySelector('.description').innerHTML = descriptionTrim(this.description);

		if (this.fileLink?.link) {
			projectSection.querySelector('.download-btn').href = this.fileLink.link;

			if (this.fileLink?.example) {
				projectSection.querySelector('.secondary-btn').href = this.fileLink.example;
			}
		} else {
			projectSection.querySelector('.action_buttons').remove();
		}

		return projectSection.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').Project[]} data
	 */
	static createListFromJson(data) {
		return data.map(ProjectSection.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').Project} data
	 */
	static createSingleFromJson(data) {
		return new ProjectSection({
			title: data.title,
			description: data.description,
			fileLink: data.fileLink,
		});
	}
}
