import { ROOT_PATH } from '../shared/constants.js';

export function navigateToHomePage() {
	const screenWidth = Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth,
	);

	// TODO: fix magic number
	if (screenWidth > 850) {
		window.location.replace(ROOT_PATH);
	}
}
