// imports
import { Page } from '../../core/Page.js';
import { Icons } from '../../js/components/icons.js';
import { Tabs } from '../../js/components/tabs.js';
import { ProjectSection } from '../../js/components/projectSection.js';
import { Resource } from '../../js/components/resources.js';
import { addCollapseFunction } from '../../utils/descriptionSlicer.js';
import { DataType } from '../../shared/constants.js';
import { getSearchParams } from '../../services/url.js';

// Data file paths
let LECTURER_INFO_JSON = 'data/jsons/lecturer.json';
let INDEX_JSON = 'data/jsons/index.json';
let RESOURCES_JSON = 'data/jsons/resources.json';
let SECTIONS = ['Biography', 'Personal-projects', 'Recommended-resources'];

let ALL_TOPIC_KEY = 'all';

class About extends Page {
	#openSection = null;
	#resourcesObj = {};

	constructor() {
		super();
		const searchParams = getSearchParams();
		if (searchParams.has('section')) {
			this.#openSection = searchParams.get('section');
		} else {
			this.#openSection = SECTIONS[0];
		}
	}

	async #setupPageData() {
		this.#resourcesObj = await this.loadPageData(RESOURCES_JSON, DataType.JSON);
	}

	async build() {
		await this.#setupPageData();

		const [indexLecturerObj, infoLecturerObj] = await Promise.all([
			this.loadPageData(INDEX_JSON, DataType.JSON),
			this.loadPageData(LECTURER_INFO_JSON, DataType.JSON),
		]);

		// build tabs' content
		this.buildBiography(indexLecturerObj);
		this.buildProjects(indexLecturerObj);
		this.buildResources(false, 'buildFilters');

		this.createTabsSection();

		this.buildInfo(infoLecturerObj);

		// pick the right tab according to the link
		this.pickTab();
	}

	createTabsSection() {
		Tabs.createTabsSection();
		Tabs.addTab('Biography', 'Bio');
		Tabs.addTab('Personal projects', 'Projects');
		Tabs.addTab('Recommended resources', 'Resources', true);
	}

	pickTab() {
		for (var sectionIndex = 0; sectionIndex < SECTIONS.length; sectionIndex++) {
			if (this.section_open == SECTIONS[sectionIndex]) {
				Tabs.activateDefault(sectionIndex);
				return;
			}
		}
		Tabs.activateDefault(0); // default case;
	}

	buildInfo(lecturerObj) {
		// setting titles
		document.getElementById('lecturer_name').innerHTML = lecturerObj.name;
		document.getElementById('lecturer_position').innerHTML = lecturerObj.position;
		document.getElementById('info-icon').innerHTML = Icons.info();

		//contacts
		this.buildContact(lecturerObj);
		//locations
		if (lecturerObj.addresses.length != 0) {
			this.buildLocations(lecturerObj.addresses);
		} else {
			document.getElementById('lecturer_location').style.display = 'none';
		}

		this.buildMobileHeaderInfo(lecturerObj.addresses);
	}

	buildMobileHeaderInfo(addresses) {
		var str = '';
		for (let i = 0; i < addresses.length; i++) {
			str +=
				'<div class="organization">' +
				addresses[i].university +
				'</div>' +
				'<div>' +
				addresses[i].location +
				'</div>' +
				'<div>' +
				addresses[i].hours +
				'</div>';
			if (i + 1 < addresses.length) str += '<br>';
		}
		document.getElementById('lecturer_location_mobile').innerHTML = str;
	}

	buildBiography(lecturerObj) {
		document.getElementById('bio_text').innerHTML = lecturerObj['biography'];
	}

	buildProjects(lecturerObj, topic, change = false) {
		let projects = lecturerObj['currentProjects'];
		if (!change) {
			let topics = this.buildTopicNav(lecturerObj, projects);
			if (topics != null) {
				document.getElementById('topics_list').firstChild.classList.add('active-topic');
				this.dynamicBuildProjects(projects, topics[0]);
			} else {
				let projectsList = ProjectSection.createListFromJson(projects);
				let panels = '';
				let n = projectsList.length;
				for (let i = 0; i < n; i++) {
					panels += '<div class="projects-panel">' + projectsList[i].toHtml() + '</div>';
					if (i + 1 < n) panels += '<hr>';
				}
				document.getElementById('projects_cards').innerHTML = panels;
			}
		} else {
			this.dynamicBuildProjects(projects, topic);

			addCollapseFunction();
		}
	}

	dynamicBuildProjects(projects, topic) {
		let projectsList = ProjectSection.filterList(projects, 'topic', topic);
		projectsList = ProjectSection.createListFromJson(projectsList);
		let panels = '';
		for (let i = 0; i < projectsList.length; i++) {
			panels += '<div class="projects-panel">' + projectsList[i].toHtml() + '</div>';
		}
		document.getElementById('projects_cards').innerHTML = panels;
	}

	buildTopicNav(lecturerObj, projects) {
		// build topics navigation bar
		let topics = new Set();
		topics.add(ALL_TOPIC_KEY);
		for (let i = 0; i < projects.length; i++) {
			topics.add(projects[i].topic);
		}

		if (topics.size < 3) {
			document.getElementById('topics').style.display = 'none';
			return null;
		}
		let topics_list = document.getElementById('topics_list');

		let topicArr = [];
		const topicIter = topics.values();
		for (let i = 0; i < topics.size; i++) {
			let t = document.createElement('LI');
			t.classList.add('topic');
			let text = topicIter.next().value;
			t.addEventListener('click', () => {
				let allTopics = document.getElementsByClassName('topic');
				for (let i = 0; i < allTopics.length; i++) {
					allTopics[i].classList.remove('active-topic');
				}
				t.classList.add('active-topic');
				this.buildProjects(lecturerObj, text, true);
			});
			t.innerHTML = text;
			topics_list.appendChild(t);
			topicArr.push(text);
		}
		return topicArr;
	}

	/* build contact info section */
	buildContact(lecturerObj) {
		let cv = lecturerObj.cvfile;
		let email = lecturerObj.email;
		let phone = lecturerObj.phone;
		let linkedin = lecturerObj.linkedin_link;
		let google = lecturerObj.google_scholar_link;
		let facebook = lecturerObj.facebook_link;

		let contacts = document.getElementById('contacts');
		let mobileContacts = document.getElementById('contacts-mobile');

		if (cv != '') {
			let elem = document.createElement('A');
			elem.href = cv;
			elem.id = 'cv';
			elem.innerHTML = Icons.cv() + '<span style="margin-left: 5px;">Download CV</span>';
			contacts.appendChild(elem);

			let elem_mob = document.createElement('A');
			elem_mob.href = cv;
			elem_mob.innerHTML = Icons.cv();
			elem_mob.classList.add('social-icon');
			mobileContacts.appendChild(elem_mob);
		}

		if (email != '') {
			let elem = document.createElement('P');
			elem.innerHTML = Icons.mail() + ' ' + email;
			contacts.appendChild(elem);

			let elem_mob = document.createElement('A');
			elem_mob.innerHTML = Icons.mail_mobile();
			elem_mob.href = 'mailto:' + email;
			elem_mob.classList.add('social-icon');
			mobileContacts.appendChild(elem_mob);
		}

		if (phone != '') {
			let elem = document.createElement('P');
			elem.innerHTML = Icons.phone() + ' ' + phone;
			contacts.appendChild(elem);

			let elem_mob = document.createElement('A');
			elem_mob.innerHTML = Icons.phone();
			elem_mob.href = 'tel:' + phone;
			elem_mob.classList.add('social-icon');
			mobileContacts.appendChild(elem_mob);
		}

		if (linkedin != '') {
			let linkedinIcon = document.createElement('A');
			linkedinIcon.innerHTML = Icons.linkedin();
			linkedinIcon.classList.add('social-icon');
			linkedinIcon.href = linkedin;
			contacts.appendChild(linkedinIcon);
			mobileContacts.appendChild(linkedinIcon);
		}

		if (google != '') {
			let googleIcon = document.createElement('A');
			googleIcon.innerHTML = Icons.google();
			googleIcon.classList.add('social-icon');
			googleIcon.href = google;
			contacts.appendChild(googleIcon);
			mobileContacts.appendChild(googleIcon);
		}

		if (facebook != '') {
			let fbIcon = document.createElement('A');
			fbIcon.innerHTML = Icons.about_facebook();
			fbIcon.classList.add('social-icon');
			fbIcon.href = facebook;
			contacts.appendChild(fbIcon);
			mobileContacts.appendChild(fbIcon);
		}
	}

	/* build locations info section */
	buildLocations(addresses) {
		//adding headlines
		document.getElementById('organization').innerHTML =
			Icons.buildings() + "<div class='after-icon-cell'> Organization </div>";
		document.getElementById('room').innerHTML =
			Icons.location() + "<div class='after-icon-cell'> Office  </div>";
		document.getElementById('hours').innerHTML =
			Icons.clock() + "<div class='after-icon-cell'> Open door hours  </div>";

		var info_table = document.getElementById('info-table');

		for (let i = 0; i < addresses.length; i++) {
			var row = info_table.insertRow(-1);
			var cell_university = row.insertCell(0);
			cell_university.innerHTML = addresses[i].university;
			var cell_location = row.insertCell(1);
			cell_location.innerHTML = addresses[i].location;
			var cell_hours = row.insertCell(2);
			cell_hours.innerHTML = addresses[i].hours;
		}
	}

	/* build resources tab content*/
	buildFilters(rList) {
		this.buildOneFilter(rList, 'year');
		this.buildOneFilter(rList, 'type');
		this.buildOneFilter(rList, 'topic');
	}

	buildOneFilter(rList, fName) {
		let filters = new Set();
		for (let i = 0; i < rList.length; i++) {
			let text = rList[i][fName];
			if (typeof text == 'string') {
				text = text.trim();
				text = text.toLowerCase();
			}
			filters.add(text);
		}

		filters = Array.from(filters);
		let filter = document.getElementById(fName + '-filter');
		if (filters.length > 1) {
			for (let i = 0; i < filters.length; i++) {
				let optionElement = document.createElement('OPTION');
				optionElement.innerHTML = filters[i];
				filter.appendChild(optionElement);
			}
			let filter_btn = document.getElementById('filter-btn');
			filter_btn.innerHTML = Icons.filter() + ' Filter';
		} else {
			document.getElementById(fName + '-filter').style.display = 'none';
		}
	}

	buildResources(change = false, filterName) {
		this.clearResources();
		let res_section = document.getElementById('resources_section');
		let resourcesList = Resource.createListFromJson(this.#resourcesObj['resources']);
		if (filterName == 'buildFilters') {
			document.getElementById('resources_section').style.display = '';
			this.buildFilters(resourcesList);
		}
		if (!change) {
			if (resourcesList.length == 0) {
				document.getElementById('resources_filters').style.display = 'none';
				document.getElementById('filter_by').innerHTML = 'No resources to show.';
				let filter_btn = (document.getElementById('filter-btn').innerHTML =
					'No resources to show.');
			} else {
				for (let i = 0; i < resourcesList.length; i++) {
					res_section.innerHTML += resourcesList[i].toHtml();
				}
			}
		} else {
			let selector = document.getElementById(filterName + '-filter');
			let selectorIndex = selector.selectedIndex;
			let filter = selector.options[selectorIndex].value;
			selector.classList.add('active-sort-button');
			for (let i = 0; i < resourcesList.length; i++) {
				let value = resourcesList[i][filterName];
				if (typeof value == 'string') {
					value = value.trim().toLowerCase();
				}

				if (value == filter) {
					res_section.innerHTML += resourcesList[i].toHtml();
				}
				let reset = document.getElementById('reset-btn');
				reset.innerHTML = Icons.reset() + ' Reset';
			}
			addCollapseFunction();
		}
	}

	clearResources() {
		let res_section = document.getElementById('resources_section');
		res_section.innerHTML = '';
	}

	clearFiltersDesign() {
		let f = document.getElementsByClassName('active-sort-button');
		document.getElementById('reset-btn').style.display = 'none';
		if (f.length == 0) return;
		f[0].selectedIndex = 0;
		f[0].classList.remove('active-sort-button');
		//document.getElementById("reset-btn").style.display = "none";
	}

	/*
	Show/hide filters menu
	*/
	filtersDisplay() {
		//relevent for mobile only
		if (window.innerWidth > 430) return;
		let filters = document.getElementsByClassName('resources-filters')[0];
		if (filters.style.display == 'none') {
			filters.style.display = 'block';
		} else {
			filters.style.display = 'none';
		}
	}
}

document.aboutPage = new About();
document.aboutPage.build();
document.getElementById('reset-btn').addEventListener('click', () => {
	document.aboutPage.clearFiltersDesign();
	document.aboutPage.buildResources();
});

document.getElementById('year-filter').addEventListener('change', () => {
	filterFilters('year');
});
document.getElementById('type-filter').addEventListener('change', () => {
	filterFilters('type');
});
document.getElementById('topic-filter').addEventListener('change', () => {
	filterFilters('topic');
});
document.getElementById('filter-btn').addEventListener('click', () => {
	document.aboutPage.filtersDisplay();
});

function filterFilters(fName) {
	if (document.getElementById(fName + '-filter').selectedIndex != 0) {
		document.aboutPage.clearFiltersDesign();
		document.getElementById('reset-btn').style.display = '';
		document.aboutPage.buildResources(true, fName);
	}
}
addCollapseFunction();

export { About };
