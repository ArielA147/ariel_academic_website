import { PublicationCard } from '../../components/publication-card.js';
import { addCollapseFunction } from '../../utils/descriptionSlicer.js';
import { Icons } from '../../components/icons.js';
import { Page } from '../../core/Page.js';
import { DataType, JSON_FILE_PATHS } from '../../constants/data.js';
import { getQueryParams } from '../../services/url.js';
import { TEMPLATES_LOADED_EVENT } from '../../constants/events.js';
import {
	filterItemsByKeyValue,
	groupItemsByKey,
	sortItemsByKey,
} from '../../services/data-manipulator.js';

const default_sorter = 'year';
const default_filter = null;

// TODO: add the filter and order type to the url.
// if they exist in the URL, load them into the page and show the relevant/filtered data.
class AcademicPublications extends Page {
	#publicationsList = []; // list of PublicationCard objects
	#sorter = default_sorter;

	async build() {
		await this.#setupPublications();
		const queryParams = getQueryParams();

		if (queryParams.get('sort') != null) {
			this.#sorter = queryParams.get('sort');
		} else {
			this.#sorter = default_sorter;
			console.log('AcademicPublications.build did not find sorter, using default');
		}

		let filter;
		if (queryParams.get('filter') != null) {
			filter = queryParams.get('filter');
		} else {
			filter = default_filter;
			console.log('AcademicPublications.build did not find filter, using default');
		}

		// build the page itself
		await this.buildHeader(this.#sorter, filter);
		await this.buildBody(this.#sorter, filter);

		addCollapseFunction();
	}

	async #setupPublications() {
		/** @type {import('../../constants/types.js').AcademicPublication[]} */
		const publications = await this.loadPageData(JSON_FILE_PATHS.PUBLICATIONS_JSON, DataType.JSON);

		this.#publicationsList = PublicationCard.createListFromJson(publications);
	}

	/* build section functions */

	async buildHeader(sorter = default_sorter, filter = default_filter) {
		try {
			// highlight the sort button which is active
			document.getElementById('sort-btn-' + sorter).classList.add('active-sort-button');

			// find all unique years/types/topics in the data
			var years = [];
			var topics = [];
			var types = [];
			for (var pubIndex = 0; pubIndex < this.#publicationsList.length; pubIndex++) {
				var item = this.#publicationsList[pubIndex];
				years.push(item.year);
				topics.push(item.topic);
				types.push(item.type);
			}
			// sort to make sure the order is always the same
			years.sort();
			years.reverse();
			topics.sort();
			types.sort();

			// build the year filter //
			AcademicPublications.fulfilDropdown('year-filter', years);
			// build the type filter //
			AcademicPublications.fulfilDropdown('topic-filter', topics);
			// build the topic filter //
			AcademicPublications.fulfilDropdown('type-filter', types);

			let reset = document.getElementById('reset-btn');
			reset.innerHTML = Icons.reset() + ' Reset';
			reset.addEventListener('click', async () => {
				this.clearFilterViewSelect();
				await this.buildBody();
			});
		} catch (error) {
			console.log('Error at AcademicPublications.buildHeader saying: ' + error);
		}
	}

	async buildBody(
		sorter = default_sorter,
		filter = default_filter,
		filterProperty = default_sorter,
	) {
		if (filter == default_filter) {
			document.getElementById('reset-btn').style.display = 'none';
		} else {
			document.getElementById('reset-btn').style.display = '';
		}
		// perpare ds //
		// sort the list
		let buildPublicationList = sortItemsByKey(this.#publicationsList, sorter);

		// if filter needed
		if (filter != null) {
			// filter the needed list only
			buildPublicationList = filterItemsByKeyValue(buildPublicationList, filterProperty, filter);
		}

		// split into the right sets
		const publicSets = groupItemsByKey(buildPublicationList, sorter);

		// build the UI //
		try {
			if (buildPublicationList.length > 0) {
				let answerHtml = '';
				let keys = [];

				for (var spliterKey in publicSets) {
					keys.push(spliterKey);
				}
				keys = keys.sort();

				// edge - case, years we wish to get in the decreasing order
				if (sorter == 'year') {
					keys = keys.reverse();
				}

				for (var spliterKeyIndex = 0; spliterKeyIndex < keys.length; spliterKeyIndex++) {
					// add spliter
					// answerHtml += "<h3>" + keys[spliterKeyIndex] + "</h3>";
					// add elements inside the list
					for (let i = 0; i < publicSets[keys[spliterKeyIndex]].length; i++) {
						const publication = publicSets[keys[spliterKeyIndex]][i];
						const publicationCard = publication.render();
						answerHtml += publicationCard.outerHTML;
					}
				}
				document.getElementById('publications-body').innerHTML = answerHtml;
			} // show error message
			else {
				document.getElementById('publications-body').innerHTML =
					"<h3>Don't have publication with this filter</h3>"; // should not happen
			}
		} catch (error) {
			console.log('Error at AcademicPublications.buildBody saying: ' + error);
		}
	}

	/* end -  build sections functions */

	/* filtering and reorder of publication list functions */

	/* end - filtering and reorder of publication list functions */

	/* GUI functions */

	// this function controls the Order By section appearance in mobile view
	showOrderOptions(element) {
		let x = document.getElementById('orderOptions');
		if (x.style.display === 'none') {
			x.style.display = 'initial';
		} else {
			x.style.display = 'none';
		}
	}

	// this function controls the Filter section appearance in mobile view
	showFilterOptions(element) {
		let x = document.getElementById('FilterOptions');
		if (x.style.display === 'none') {
			x.style.display = 'initial';
		} else {
			x.style.display = 'none';
		}
	}

	async changeSort(sort_value) {
		document.getElementById('sort-btn-topic').classList.remove('active-sort-button');
		document.getElementById('sort-btn-year').classList.remove('active-sort-button');
		document.getElementById('sort-btn-type').classList.remove('active-sort-button');
		document.getElementById('sort-btn-' + sort_value).classList.add('active-sort-button');

		await this.buildBody(sort_value, default_filter);
	}

	async changeFilterYear() {
		// get value
		var selector = document.getElementById('year-filter');
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != 'year') {
			// mark this filter as choosen
			selector.classList.add('active-sort-button');
			document.getElementById('year-filter').selectedIndex = '' + selectorIndex;
		} else {
			filter = default_filter;
		}

		await this.buildBody(this.#sorter, filter, 'year');
	}

	async changeFilterType() {
		// get value
		var selector = document.getElementById('type-filter');
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != 'type') {
			// mark this filter as choosen
			selector.classList.add('active-sort-button');
			document.getElementById('type-filter').selectedIndex = '' + selectorIndex;
		} else {
			filter = default_filter;
		}

		await this.buildBody(this.#sorter, filter, 'type');
	}

	async changeFilterTopic() {
		// get value
		var selector = document.getElementById('topic-filter');
		var selectorIndex = selector.selectedIndex;
		var filter = selector.options[selectorIndex].value;

		// clear from the other for any case
		this.clearFilterViewSelect();

		if (filter.toLowerCase() != 'topic') {
			// mark this filter as choosen
			selector.classList.add('active-sort-button');
			document.getElementById('topic-filter').selectedIndex = '' + selectorIndex;
		} else {
			filter = default_filter;
		}

		await this.buildBody(this.#sorter, filter, 'topic');
	}

	clearFilterViewSelect() {
		document.getElementById('type-filter').classList.remove('active-sort-button');
		document.getElementById('type-filter').selectedIndex = '0';
		document.getElementById('year-filter').classList.remove('active-sort-button');
		document.getElementById('year-filter').selectedIndex = '0';
		document.getElementById('topic-filter').classList.remove('active-sort-button');
		document.getElementById('topic-filter').selectedIndex = '0';
	}

	/* end - GUI functions */

	/* help functions */

	static fulfilDropdown(id, itemsList) {
		if (Array.from(new Set(itemsList)).length > 1) {
			itemsList = [...new Set(itemsList)];
			var html = '';
			for (var itemIndex = 0; itemIndex < itemsList.length; itemIndex++) {
				html +=
					'<option value="' + itemsList[itemIndex] + '">' + itemsList[itemIndex] + '</option>';
			}
			document.getElementById(id).innerHTML += html;
		} else {
			document.getElementById(id).style.display = 'none';
		}
	}

	/* end -  help functions  */
}

// run the class build on page load
document.academicPublications = new AcademicPublications();
document.addEventListener(TEMPLATES_LOADED_EVENT, async () => {
	await document.academicPublications.build();
});

export { AcademicPublications };
