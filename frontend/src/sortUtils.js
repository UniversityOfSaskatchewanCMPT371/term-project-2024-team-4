/*
Utility file for sorting data
*/

/**
 * Sorts a JSON array given sorting criteria
 * Pre-Conditions:
 * 	- JSON objects need to contain a `createdDate` & `name` field
 *  - sortValue must be one of: newest, oldest, alphabetical_ascending, alphabetical_descending
 * Post-Conditions:
 *   - Original JSON data is kept but is sorted based on the given sorting criteria
 * @param {Object[]} data - array of JSON objects to be sorted
 * @param {string} sortValue - criteria to be sorted: "newest", "oldest", "alphabetical_ascending", "alphabetical_descending"
 * @returns {Object[]} a sorted array of JSON objects
 */
export function sortData(data, sortValue) {
	return;
}
