import { default_data } from "./default_data";
import { SaverLoader } from "./saverloader.svelte";
import type { Snapshots } from "./saverloader.svelte";

type Key = keyof typeof default_data;
export const all_champions: Array<string> = [];
export let first_champion: string | null = null;

let temp_champions: Array<string> = [];
for (const role in default_data) {
	const key = role as Key;
	temp_champions = [...temp_champions, ...default_data[key]];
}

for (const champion of temp_champions) {
	if (!all_champions.includes(champion)) {
		all_champions.push(champion);
	}
}
all_champions.sort();

function passesLegacyQuery(string: string, query: string): boolean {
	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	let clean_string = string.replace(/\s/g, "");
	clean_string = string.toLowerCase();

	if (clean_string.includes(clean_query)) {
		return true;
	}
	return false;
}

function getLegacyQueryChampions(
	query: string,
	champions: Array<string>,
): Array<string> {
	champions = champions.sort();

	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();
	if (clean_query == "") {
		return champions;
	}

	return champions.filter((current) => passesLegacyQuery(current, query));
}

function getModernQueryChampions(
	query: string,
	champions: Array<string>,
): Array<string> {
	champions = champions.sort();

	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	if (clean_query == "") {
		return champions;
	}

	const filtered_champions: Array<string> = [];

	for (const champion of champions) {
		if (champion == clean_query) {
			filtered_champions.push(champion);
		}
	}

	for (const champion of champions) {
		if (champion.includes(clean_query)) {
			filtered_champions.push(champion);
		}
	}

	for (const champion of champions) {
		let query_index = 0;

		for (let i = 0; i < champion.length; i++) {
			const letter = champion[i];
			if (clean_query[query_index] == letter) {
				query_index += 1;
			}
			if (query_index == clean_query.length) {
				filtered_champions.push(champion);
				break;
			}
		}
	}

	return filtered_champions;
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

	let filtered_champions: Array<string> = [];
	const settings = SaverLoader.getSettings();
	if (settings.useLegacySearch) {
		filtered_champions = getLegacyQueryChampions(query, champions);
	} else {
		filtered_champions = getModernQueryChampions(query, champions);
	}

	if (filtered_champions.length === 0) {
		filtered_champions = all_champions.filter((current) =>
			passesLegacyQuery(current, query),
		);
	}

	const no_duplicates: Array<string> = [];

	for (const champion of filtered_champions) {
		if (!no_duplicates.includes(champion)) {
			no_duplicates.push(champion);
		}
	}
	no_duplicates.sort();

	if (no_duplicates.length > 0) {
		first_champion = no_duplicates[0];
	} else {
		first_champion = null;
	}

	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	for (const champion of filtered_champions) {
		if (champion == clean_query) {
			first_champion = champion;
		}
	}

	return no_duplicates;
}

export function getFilteredSnapshots(
	query: string,
	snapshots: Snapshots,
): Snapshots {
	let clean_query = query.replace(/\s/g, "");
	clean_query = clean_query.toLowerCase();

	const filtered_snapshots = snapshots.filter((current) => {
		let clean_name = current.tierlist.name.replace(/\s/g, "");
		clean_name = current.tierlist.name.toLowerCase();

		if (clean_name.includes(clean_query)) {
			return true;
		}

		let champions_string = "";
		for (const tier of current.tierlist.tiers) {
			for (const champion of tier.champions) {
				champions_string += champion;
			}
		}

		if (champions_string.includes(clean_query)) {
			return true;
		}

		return false;
	});

	return filtered_snapshots;
}
