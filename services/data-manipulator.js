/**
 * Sort a list of objects by a specified key.
 * @param {any[]} items
 * @param {string} key
 * @returns {any[]}
 */
export function sortItemsByKey(items, key) {
	return items.sort((a, b) => a[key] - b[key]);
}

/**
 * Filter a list of objects by a specified key and value.
 * @param {any[]} items
 * @param {string} key
 * @param {any | any[]} filterValues
 * @returns {any[]}
 */
export function filterItemsByKeyValue(items, key, filterValues) {
	const values = Array.isArray(filterValues) ? filterValues : [filterValues];
	return items.filter((item) => item[key] === values.includes(item[key]));
}

/**
 * Split a list of objects into groups based on a specified key.
 * @param {any[]} items
 * @param {string} key
 * @returns {any[]}
 */
export function groupItemsByKey(items, key) {
	return items.reduce((acc, item) => {
		const value = item[key];
		const subGroup = acc[value] || [];
		subGroup.push(item);
		acc[value] = subGroup;

		return acc;
	}, {});
}
