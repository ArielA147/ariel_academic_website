import { ResearchTeamMember } from './researchTeamMember.js';
import { CourseResource } from './courseResource.js';
import { descriptionTrim } from '../../../utils/descriptionSlicer.js';

class ResearchProject {
	constructor(
		name,
		participents,
		description,
		startMonth,
		startYear,
		endMonth,
		endYear,
		teamMembers,
		relevantResources,
	) {
		super();
		this.name = name;
		this.participents = participents;
		this.description = description;
		this.startMonth = startMonth;
		this.startYear = startYear;
		this.endMonth = endMonth;
		this.endYear = endYear;
		this.teamMembers = teamMembers;
		this.relevantResources = relevantResources;
	}

	// convert the object into HTML
	toHtml() {
		let html = '<div class="research">';

		html += this._createResearchTitleSection();
		html += '<div class="content-text">' + descriptionTrim(this.description) + '</div>';

		if (this.participents.length > 0) {
			html += this._createTeamSection();
		}

		if (this.relevantResources.length > 0) {
			html += this._createLinksSection();
		}

		html += '</div>';

		return html;
	}

	// build a list of this object from Json object
	static createListFromJson(jsonObj) {
		var listStudent = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++) {
			ResearchProject.push(Course.createFromJson(jsonObj[publicationIndex]));
		}
		return listStudent;
	}

	// build a list of this object from Json object
	static createFromJson(jsonObj) {
		return new ResearchProject(
			jsonObj['name'],
			ResearchTeamMember.createListFromJson(jsonObj['participants']),
			jsonObj['description'],
			jsonObj['startMonth'],
			jsonObj['startYear'],
			jsonObj['endMonth'],
			jsonObj['endYear'],
			jsonObj['teamMembers'],
			CourseResource.createListFromJsonWithoutOrder(jsonObj['relevantResources']),
		);
	}

	_createResearchTitleSection() {
		return (
			'<div class="research-title space-between"><h3 class="content-title">' +
			this.name +
			'</h3><p class="research-duration">[' +
			this.startMonth +
			'/' +
			this.startYear +
			' - ' +
			this.endMonth +
			'/' +
			this.endYear +
			']</p></div><hr class="blue-hr">'
		);
	}

	_createTeamSection() {
		let html = '<div class="team-section">';

		html +=
			'<div class="collapsing-section-title"><div class="team-title space-between"><p class="content-subtitle">Team</p><svg class="moreLessButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8" width="13" height="8">' +
			'<path fill="black" d="M 1.94516 7.41 L 6.53516 2.83 L 11.1252 7.41 L 12.5352 6 L 6.53516 0 L 0.535156 6 L 1.94516 7.41 Z" /></svg></div><hr></div>';

		html += '<div class="collapsing-section open-section">';

		for (let i = 0; i < this.participents.length; i += 3) {
			// make rows of 3 team members.
			// if the row is full - justify with space between
			// otherwise - align to the left
			let mem1 = this.participents[i];
			if (i + 1 < this.participents.length) {
				let mem2 = this.participents[i + 1];
				if (i + 2 < this.participents.length) {
					let mem3 = this.participents[i + 2];
					html += '<div class="team-content-section">';
					html += mem1.toHtml();
					html += mem2.toHtml();
					html += mem3.toHtml();
				} else {
					// html += '<div class="team-content-section-no-space-between">';
					html += '<div class="team-content-section-no-space-between">';
					html += mem1.toHtml();
					html += mem2.toHtml();
				}
			} else {
				html += '<div class="team-content-section-no-space-between">';
				html += mem1.toHtml();
			}
			html += '</div>';
		}

		// end of content section
		html += '</div>';

		// end of whole team section
		html += '</div>';

		return html;
	}

	_createLinksSection() {
		let html = '<div class="links-section">';

		html +=
			'<div class="collapsing-section-title"><div class="relevant-links-title space-between"><p class="content-subtitle">Relevant Links</p><svg class="moreLessButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8" width="13" height="8">' +
			'<path fill="black" d="M 1.94516 7.41 L 6.53516 2.83 L 11.1252 7.41 L 12.5352 6 L 6.53516 0 L 0.535156 6 L 1.94516 7.41 Z" /></svg></div><hr></div>';

		html += '<div class="relevant-links-content-section collapsing-section open-section">';

		this.relevantResources.forEach((resource) => {
			html += resource.toHtml();
		});

		// end of content section
		html += '</div>';

		// end of whole link section
		html += '</div>';

		return html;
	}
}

export { ResearchProject };
