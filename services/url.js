/**
 * @returns {URLSearchParams}
 */
export function getSearchParams() {
	return new URLSearchParams(window.location.search);
}

export function setSearchParam(name, value) {
	name = encodeURIComponent(name);
	value = encodeURIComponent(value);

	const searchParams = getSearchParams();
	searchParams.set(name, value);

	history.pushState(null, null, `?${searchParams.toString()}`);
}
