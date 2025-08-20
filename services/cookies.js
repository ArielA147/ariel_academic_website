/**
 * @param {string} name
 * @returns {string | null}
 */
export function getCookie(name) {
	const cookies = document.cookie.split('; ');

	for (const cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key === name) {
			return decodeURIComponent(value);
		}
	}

	return null;
}

/**
 * @param {string} name
 * @param {string} value
 * @param {number} expirationDays
 * @returns {void}
 */
export function setCookie(name, value, expirationDays = 7) {
	const oneDayMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

	const date = new Date();
	date.setTime(date.getTime() + expirationDays * oneDayMilliseconds);

	document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}
