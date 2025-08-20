/**
 * @returns {URLSearchParams}
 */
export function getQueryParams() {
	return new URLSearchParams(window.location.search);
}

/**
 * @param {string} name
 * @param {string} value
 */
export function setSearchParam(name, value) {
	name = encodeURIComponent(name);
	value = encodeURIComponent(value);

	const queryParams = getQueryParams();
	queryParams.set(name, value);

	history.pushState(null, null, `?${queryParams.toString()}`);
}
