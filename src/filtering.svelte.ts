import { default_data } from "./default_data";
import type { Snapshots } from "./saverloader.svelte";
import type { TierlistType } from "./tierlist.svelte";

type Key = keyof typeof default_data;
export let all_champions: Array<string> = [];

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

	let no_duplicates: Array<string> = [];

	for (const champion of filtered_champions) {
		if (!no_duplicates.includes(champion)) {
			no_duplicates.push(champion);
		}
	}
	no_duplicates.sort();

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
