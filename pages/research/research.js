// imports
import { Page } from '../../core/Page.js';
import { removeAlertsPanels } from '../../core/main.js';
import { Icons } from '../../js/components/icons.js';
import { ResearchPosition } from '../../js/components/researchPosition.js';
import { ResearchProject } from '../../js/components/researchProject.js';
import { Tabs } from '../../js/components/tabs.js';
import { DataType } from '../../shared/constants.js';
import { addCollapseFunction } from '../../utils/descriptionSlicer.js';

// Data file paths
let RESEARCH_JSON = 'data/jsons/research.json';
let SECTIONS = ['Ongoing-Projects', 'Previous-Projects', 'Work-with-me'];

/*
	Single instance class to build about page with dynamic content from JSONS from the server
*/
class Research extends Page {
	#openSection = null;
	#jsonData = {};
	#ongoingProjects = [];
	#previousProjects = [];
	#openPositions = [];

	constructor() {
		super();

		const queryParams = this.getSearchParams();
		if (queryParams.has('section')) {
			this.#openSection = queryParams.get('section');
		} else {
			this.#openSection = SECTIONS[0];
		}

		// remove alert as they not in use and can make problems
		removeAlertsPanels();
	}

	async #initializeData() {
		this.#jsonData = await this.loadPageData(RESEARCH_JSON, DataType.JSON);

		const nowDate = new Date();

		for (let index = 0; index < this.#jsonData['projects'].length; index++) {
			const newProject = ResearchProject.createFromJson(this.#jsonData['projects'][index]);
			//create lists of current and prev researches using date calculation.
			if (
				newProject.end_year < nowDate.getFullYear() ||
				(newProject.end_year == nowDate.getFullYear() &&
					newProject.end_month <= nowDate.getMonth() + 1)
			) {
				this.#previousProjects.push(newProject);
			} else {
				this.#ongoingProjects.push(newProject);
			}
		}

		for (var index = 0; index < this.#jsonData['open_positions'].length; index++) {
			this.#openPositions.push(
				ResearchPosition.createFromJson(this.#jsonData['open_positions'][index]),
			);
		}
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	async build() {
		await this.#initializeData();

		this.createTabsSection();

		// build the tabs' data and open the needed tab according to the link
		let tabsHTML = '';
		tabsHTML += this.buildOngoing();
		tabsHTML += this.buildPrevious();
		tabsHTML += this.buildWorkWithMe();
		document.getElementById('main-body-page').innerHTML += tabsHTML;

		// open the right tab according to the url
		this.pickTab();

		this._addCollapsonigSections();
		addCollapseFunction();
	}

	createTabsSection() {
		Tabs.createTabsSection();
		Tabs.addTab('Ongoing Projects', 'Ongoing');
		Tabs.addTab('Previous Projects', 'Previous');
		Tabs.addTab('Work with me', 'Join me', true);
	}

	buildOngoing() {
		let answerHTML = '<div class="body-section">';

		this.#ongoingProjects.forEach((research, i) => {
			answerHTML += research.toHtml();

			if (i < this.#ongoingProjects.length - 1) {
				answerHTML += '<div class="section-seperator">' + Icons.dots_seperator() + '</div>';
			}
		});

		answerHTML += '</div>';
		return answerHTML;
	}

	buildPrevious() {
		let answerHTML = '<div class="body-section">';

		this.#previousProjects.forEach((research, i) => {
			answerHTML += research.toHtml();

			if (i < this.#previousProjects.length - 1) {
				answerHTML += '<div class="section-seperator">' + Icons.dots_seperator() + '</div>';
			}
		});

		answerHTML += '</div>';
		return answerHTML;
	}

	buildWorkWithMe() {
		let answerHTML = '<div class="body-section">';

		if (this.#jsonData['work_with_me_opening'] != '') {
			answerHTML +=
				'<div class="opening-statment">' + this.#jsonData['work_with_me_opening'] + '</div>';
		}

		this.#openPositions.forEach((position, i) => {
			answerHTML += position.toHtml();

			if (i < this.#openPositions.length - 1) {
				answerHTML += '<div class="section-seperator">' + Icons.dots_seperator() + '</div>';
			}
		});

		answerHTML += '</div>';
		return answerHTML;
	}

	pickTab() {
		for (var sectionIndex = 0; sectionIndex < SECTIONS.length; sectionIndex++) {
			if (this.#openSection == SECTIONS[sectionIndex]) {
				Tabs.activateDefault(sectionIndex);
				return;
			}
		}
		Tabs.activateDefault(0); // default case;
	}

	_addCollapsonigSections() {
		let sections = document.getElementsByClassName('collapsing-section-title');

		for (let i = 0; i < sections.length; i++) {
			sections[i].addEventListener('click', function (event) {
				event.target.parentElement.nextSibling.classList.toggle('open-section');

				sections[i].getElementsByClassName('moreLessButton')[0].classList.toggle('flip180');
			});
		}
	}
}

document.researchPage = new Research();
await document.researchPage.build();

export { Research };
