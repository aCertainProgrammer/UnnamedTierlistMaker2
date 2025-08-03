export function passesLegacyQuery(string: string, query: string): boolean {
	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	if (string.includes(clean_query)) {
		return true;
	}
	return false;
}
