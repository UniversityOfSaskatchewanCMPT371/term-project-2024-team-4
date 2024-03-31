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
	return data.sort((a, b) => {
		switch (sortValue) {
		case "newest":
			console.info("Sorting sites from newest-oldest order");
			return new Date(b.createdDate) - new Date(a.createdDate);
		case "oldest":
			console.info("Sorting sites from oldest-newest order");
			return new Date(a.createdDate) - new Date(b.createdDate);
		case "alphabetical_ascending":
			console.info("Sorting sites in alphabetically ascending order");
			return a.name.localeCompare(b.name);
		case "alphabetical_descending":
			console.info("Sorting sites in alphabetically descending order");
			return b.name.localeCompare(a.name);
		default:
			console.warn("Could not sort sites.");
			return 0;
		}
	});
}
