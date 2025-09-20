import { Component } from '../../../core/Component.js';

export class ResearchTeamMember extends Component {
	name;
	title;
	role;
	websiteLink;
	googleScholarLink;
	linkedinLink;

	constructor({ name, title, role, websiteLink, googleScholarLink, linkedinLink }) {
		super(ResearchTeamMember.name);
		this.name = name;
		this.title = title;
		this.role = role;
		this.websiteLink = websiteLink;
		this.googleScholarLink = googleScholarLink;
		this.linkedinLink = linkedinLink;
	}

	render() {
		const template = this.loadTemplate();

		template.querySelector('.member-details').textContent = `${this.name}, ${this.title}`;
		template.querySelector('.member-role').textContent = this.role;

		if (this.websiteLink) {
			template.querySelector('.member-link.website').href = this.websiteLink;
		} else {
			template.querySelector('.member-link.website');
		}

		if (this.googleScholarLink) {
			template.querySelector('.member-link.google-scholar').href = this.googleScholarLink;
		} else {
			template.querySelector('.member-link.google-scholar');
		}

		if (this.linkedinLink) {
			template.querySelector('.member-link.linkedin').href = this.linkedinLink;
		} else {
			template.querySelector('.member-link.linkedin');
		}

		return template.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').ResearchParticipant[]} data
	 */
	static createListFromJson(data) {
		return data.map(ResearchTeamMember.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').ResearchParticipant} data
	 */
	static createSingleFromJson(data) {
		return new ResearchTeamMember({
			name: data.name,
			title: data.title,
			role: data.role,
			websiteLink: data.websiteLink,
			googleScholarLink: data.googleScholarLink,
			linkedinLink: data.linkedinLink,
		});
	}
}
