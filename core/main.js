import { navigateToHomePage } from '../services/navigation.js';
import { FOOTER_RENDERED_EVENT, HEADER_RENDERED_EVENT } from '../shared/events.js';
import { DataLoader } from './DataLoader.js';

let thisPage = location.href.split('/').slice(-1)[0];
if (thisPage == '') {
	thisPage = 'index';
}

await onPageLoad();

async function onPageLoad() {
	await renderHeader();
	await renderFooter();
	activeMenuLink();
	manageCollapsible();

	// cite alerts
	document.getElementById('alert-close-btn').onclick = function () {
		var div = this.parentElement;
		div.style.opacity = '0';
	};

	attachEventListeners();
}

async function renderHeader() {
	const header = await DataLoader.loadHeader();
	if (header) {
		document.getElementById('header').innerHTML = header;
		document.dispatchEvent(new Event(HEADER_RENDERED_EVENT));
	}
}

async function renderFooter() {
	const footer = await DataLoader.loadFooter();
	if (footer) {
		document.getElementById('footer').innerHTML = footer;
		document.dispatchEvent(new Event(FOOTER_RENDERED_EVENT));
	}
}

// mark the right menu link as active
function activeMenuLink() {
	$('.menu a').each(function () {
		if ($(this).attr('id') == thisPage) {
			$(this).addClass('active');
		}
	});
}

// manage collapsible
// taken from w3school: https://www.w3schools.com/howto/howto_js_collapsible.asp
function manageCollapsible() {
	var coll = document.getElementsByClassName('collapsible');
	var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener('click', function () {
			for (let j = 0; j < coll.length; j++) {
				// close all other active menus
				if (this == coll[j]) {
					// skip the current menu
					continue;
				} else {
					// check if the menu is active
					if (coll[j].classList.contains('active')) {
						// toggle the active class and close the menu
						coll[j].classList.toggle('active');
						var content = $(coll[j]).find('div')[0];
						content.style.maxHeight = null;
						content.style.opacity = null;
					}
				}
			}

			// expand the current menu
			this.classList.toggle('active');
			var content = $(this).find('div')[0];
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + 'px';
			}

			// change opacity of the menu
			if (content.style.opacity) {
				content.style.opacity = null;
			} else {
				content.style.opacity = 1;
			}
		});
	}
}

// close header mobile menu on click outside the menu
document.getElementById('mobile-menu-bg').onclick = function () {
	document.getElementById('mobile-menu').style.marginLeft = '-320px';
	document.getElementById('mobile-menu-bg').style.marginLeft = '100%';
};

document.getElementById('mobile-menu').onclick = function (e) {
	e.stopPropagation();
};

function copy_cite(input_holder_id) {
	var copyText = document.getElementById(input_holder_id).value;
	navigator.clipboard.writeText(copyText).then(
		function () {
			console.log('Async: Copying to clipboard was successful!');
		},
		function (err) {
			console.error('Async: Could not copy text: ', err);
		},
	);

	// show alert
	var alertDiv = document.getElementById('alert-close-btn').parentElement;
	document.getElementById('cite-alert').innerHTML = 'Copied: ' + copyText;
	alertDiv.style.opacity = '1';
	alertDiv.style.zIndex = '999999';
	setTimeout(function () {
		alertDiv.style.opacity = '0';
		alertDiv.style.zIndex = '-999999';
	}, 2500);
}

function attachEventListeners() {
	const logo = document.querySelector('a.logo');
	logo.addEventListener('click', navigateToHomePage);
}

// close the update section
function closeUpdates() {
	document.getElementById('update-container').classList.add('closed-section');
}

// TODO: move to alerts.js?
export function removeAlertsPanels() {
	for (var i = 1; i <= 2; i++) {
		document.getElementById('alert-panel-' + i).style.display = 'none';
	}
}
