/**
 * Sort a list of objects by a specified key.
 * @param {any[]} items
 * @param {string} key
 * @returns {any[]}
 */
// sortByProperty
export function sortItemsByKey(items, key) {
	return items.sort((a, b) => a[key] - b[key]);
}

/**
 * Filter a list of objects by a specified key and value.
 * @param {any[]} items
 * @param {string} key
 * @param {any} filterValue
 * @returns {any[]}
 */
// filterList
export function filterItemsByKeyValue(items, key, filterValue) {
	return items.filter((item) => item[key] === filterValue);
}

/**
 * Split a list of objects into groups based on a specified key.
 * @param {any[]} items
 * @param {string} key
 * @returns {any[]}
 */
// splitByProperty
export function groupItemsByKey(items, key) {
	return items.reduce((acc, item) => {
		const value = item[key];
		const subGroup = acc[value] || [];
		subGroup.push(item);
		acc[value] = subGroup;

		return acc;
	}, {});
}
