import { Component } from '../../../core/Component.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';
import { ResearchTeamMember } from './research-team-member.js';

export class ResearchProject extends Component {
	name;
	/** @type {ResearchTeamMember[]} */
	participants;
	description;
	startYear;
	endYear;
	startMonth;
	endMonth;
	teamMembers;
	/** @type {any[]} */
	relevantResources;

	constructor({
		name,
		participants,
		description,
		startYear,
		endYear,
		startMonth,
		endMonth,
		teamMembers,
		relevantResources,
	}) {
		super(ResearchProject.name);
		this.name = name;
		this.participants = participants;
		this.description = description;
		this.startYear = startYear;
		this.endYear = endYear;
		this.startMonth = startMonth;
		this.endMonth = endMonth;
		this.teamMembers = teamMembers;
		this.relevantResources = relevantResources;
	}

	render() {
		const researchProject = this.loadTemplate();

		researchProject.querySelector('.content-title').textContent = this.name;
		researchProject.querySelector(
			'.research-duration',
		).textContent = `[${this.startMonth}/${this.startYear} - ${this.endMonth}/${this.endYear}]`;

		researchProject.querySelector('.content-text').innerHTML = descriptionTrim(this.description);

		if (this.participants.length > 0) {
			const participantsSection = researchProject.querySelector('.team-content-section');

			this.participants.forEach((participant) => {
				// const wrapper = document.createElement('div')
				// wrapper.classList.add('team-content-section');
				// wrapper.appendChild(participant.render());
				participantsSection.appendChild(participant.render());
			});
		} else {
			researchProject.querySelector('.team-section').remove();
		}

		// TODO: this will render a list of CourseResource objects. doesn't seem relevant to us
		// if (this.relevantResources.length > 0) {

		// } else {
		// 	researchProject.querySelector('.links-section').remove();
		// }

		return researchProject.firstElementChild;
	}

	/**
	 * @param {import('../../../constants/types.js').Research[]} data
	 */
	static createListFromJson(data) {
		return data.map(ResearchProject.createSingleFromJson);
	}

	/**
	 * @param {import('../../../constants/types.js').Research} data
	 */
	static createSingleFromJson(data) {
		return new ResearchProject({
			name: data.name,
			participants: ResearchTeamMember.createListFromJson(data.participants),
			description: data.description,
			startYear: data.startYear,
			endYear: data.endYear,
			startMonth: data.startMonth,
			endMonth: data.endMonth,
			teamMembers: data.teamMembers,
			relevantResources: data.relevantResources,
		});
	}
}
