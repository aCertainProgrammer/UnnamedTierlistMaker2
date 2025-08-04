import { default_data } from "./default_data";

type Key = keyof typeof default_data;
export let all_champions: Array<string> = [];
for (const role in default_data) {
	const key = role as Key;
	all_champions = [...all_champions, ...default_data[key]];
}

function passesLegacyQuery(string: string, query: string): boolean {
	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	if (string.includes(clean_query)) {
		return true;
	}
	return false;
}

export function getFilteredChampions(
	query: string,
	role: string,
): Array<string> {
	let champions: Array<string> = [];
	if (role != "none") {
		const role_key = role as Key;
		champions = default_data[role_key];
	} else {
		champions = all_champions;
	}

	let filtered_champions = champions.filter((current) =>
		passesLegacyQuery(current, query),
	);

	if (filtered_champions.length === 0) {
		filtered_champions = all_champions.filter((current) =>
			passesLegacyQuery(current, query),
		);
	}

	return filtered_champions;
}
