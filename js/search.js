import { HEADER_RENDERED_EVENT } from '../shared/events.js';

let PARAM_QUERY = 'query';
var docs = [];
var doc1 = {
	id: '1',
	body: 'Example',
	shortBody: 'Example',
	title: 'Example',
	url: 'index.html',
};
docs.push(doc1);

var index = lunr(function () {
	this.field('title', { boost: 2 });
	this.field('body');
	this.ref('id');

	docs.forEach((doc) => {
		this.add(doc);
	});
});

function searchPage() {
	// get input from the user
	var queryInput = document.getElementById('search_input').value;
	query = queryInput.toLowerCase().trim();
	var queryInputMobile = document.getElementById('search_input_mobile').value;
	queryMobile = queryInputMobile.toLowerCase().trim();

	// search from mobile view, get the text from there and continue
	if (query == '' && queryMobile != '') {
		query = queryMobile;
	}

	// if empty, show alert and end process
	if (query == '') {
		showSearchAlert('Please enter a query in order to search in the website');
		return false;
	}

	var results = index.search(query, {
		fields: {
			title: { boost: 2 },
			body: { boost: 1 },
		},
	});

	// if 1 answer - go to this link
	if (results.length == 0) {
		showSearchAlert('We were not able to find any result in the website for your query');
		return false;
	} else if (results.length == 1) {
		window.open(docs[parseInt(results[0]['ref']) - 1]['url']);
		return false;
	} // if more then 1 answer - go to the search page and load there again the answers
	else {
		window.open('search.html?' + PARAM_QUERY + '=' + encodeURIComponent(query));
	}
}

function update_search_results() {
	// load query
	var query = decodeURI(GetParamsLoad(PARAM_QUERY));
	// if not query - forward to the 404 page
	if (query == null) {
		window.location.replace('404.html');
	}
	// if we have query
	var results = index.search(query, {
		fields: {
			title: { boost: 2 },
			body: { boost: 1 },
		},
	});
	// TODO: make sure the results are ordered from best score to worst

	// we can assume results >= 1 and show them
	document.getElementById('query').innerHTML = query;
	var resultListHtml = '';
	var scores_norm = 0;
	for (var i = 0; i < results.length; i++) {
		scores_norm += parseFloat(results[i]['score']);
	}
	for (var i = 0; i < results.length; i++) {
		var thisDoc = docs[parseInt(results[i]['ref']) - 1];
		resultListHtml += buildSearchResultAnswer(
			i,
			thisDoc['title'],
			parseFloat(results[i]['score']) / scores_norm,
			thisDoc['shortBody'],
			thisDoc['url'],
		);
	}

	// set the data in the page
	document.getElementById('search-results').innerHTML = resultListHtml;
}

function GetParamsLoad(param_name) {
	return (window.location.search.match(new RegExp('[?&]' + param_name + '=([^&]+)')) || [
		,
		null,
	])[1];
}

function buildSearchResultAnswer(index, title, score, short_body, url) {
	var label = url.replace('/', '').split('.')[0].toUpperCase();
	return (
		'<div class="academic-papers-panel"><div class="personal-row-col col-reverse-mobile w-100 align-space-between"><h3>' +
		title +
		'</h3></div><h4>' +
		short_body +
		'</h4><p class="search-date">Fitting ' +
		Math.round(score * 100) +
		'% to query</p><div class="personal-row space-between-search align-items-center mobile-row-breaker"><div class="search-parms-row"><span class="search-label">' +
		label +
		'</span></div><a href="' +
		url +
		'" class="secondary-btn">See this page</a></div></div>'
	);
}

// show an alert as a result of searching something in the search field
function showSearchAlert(alertText) {
	// log events
	console.log('Write search alert with the text: ' + alertText);
	// show alert
	var alertDiv = document.getElementById('search-close-btn').parentElement;
	document.getElementById('search-alert').innerHTML = alertText;
	alertDiv.style.opacity = '1';
	setTimeout(function () {
		alertDiv.style.opacity = '0';
	}, 2500);
}

document.addEventListener(HEADER_RENDERED_EVENT, (event) => {
	const desktopInput = document.getElementById('search_input');
	desktopInput.onkeyup = function (e) {
		if (e.keyCode == 13) {
			searchPage();
		}
	};
	const mobileInput = document.getElementById('search_input_mobile');
	mobileInput.onkeyup = function (e) {
		if (e.keyCode == 13) {
			searchPage();
		}
	};
});
