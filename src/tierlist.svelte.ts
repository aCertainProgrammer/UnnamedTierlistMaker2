import { SaverLoader } from "./saverloader.svelte";
import { exportData, readFile } from "./util";

export type ChampionDataSource = "tier" | "champion_selection";

export type ChampionDragDataType = {
	champion: string;
	source: ChampionDataSource;
	tier_id?: number | undefined;
};

export type TierlistType = {
	name: string;
	tiers: Array<TierType>;
};

export type TierType = {
	id: number;
	name: string;
	champions: Array<string>;
	color: TierColorType;
};

export type TierColorType =
	| "tomato"
	| "deepskyblue"
	| "limegreen"
	| "greenyellow"
	| "yellow"
	| "orange";

export const default_tierlist: TierlistType = {
	name: "",
	tiers: [
		{
			id: 0,
			name: "S",
			champions: [],
			color: "deepskyblue",
		},
		{
			id: 1,
			name: "A",
			champions: [],
			color: "limegreen",
		},
		{ id: 2, name: "B", champions: [], color: "yellow" },
		{ id: 3, name: "C", champions: [], color: "orange" },
		{ id: 4, name: "F", champions: [], color: "tomato" },
	],
};

let tierlist: TierlistType = $state(SaverLoader.getTierlist());

export function getTierlist(): TierlistType {
	return tierlist;
}

export function setTierlist(t: TierlistType): void {
	tierlist = t;
	SaverLoader.saveTierlist(tierlist);
}

export function clearTierlist(): void {
	tierlist = {
		name: tierlist.name,
		tiers: default_tierlist.tiers,
	};

	setTierlist(tierlist);
}

export function resetTierlist(): void {
	setTierlist(default_tierlist);
}

export function getNewTierName(tierlist: TierlistType): string {
	let name = "Z";
	if (tierlist.tiers.length == 0) {
		name = "S";
	} else if (tierlist.tiers.length == 1) {
		name = "A";
	} else {
		const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const lastTier = tierlist.tiers[tierlist.tiers.length - 1];
		const lastName = lastTier.name;

		for (let i = 0; i < alphabet.length - 1; i++) {
			if (lastName.toUpperCase() == alphabet[i]) name = alphabet[i + 1];
		}
	}

	return name;
}

export function exportTierlist(tierlist: TierlistType) {
	try {
		const name =
			tierlist.name.length < 200 && tierlist.name.length > 0
				? `${tierlist.name}.json`
				: "tierlist.json";
		exportData(tierlist, name);
	} catch (e) {
		console.error(e);
	}
}

export async function importTierlist(file: File) {
	const tierlist_json = await readFile(file);

	try {
		const tierlist_data = JSON.parse(tierlist_json);
		const tierlist = validateTierlist(tierlist_data);
		setTierlist(tierlist);
	} catch (e) {
		console.error(e);
	}
}

export function validateTierlist(tierlist: TierlistType): TierlistType {
	if (tierlist.tiers == undefined) {
		throw "tierlist.tiers is undefined";
		return default_tierlist;
	}
	if (tierlist.name == undefined) {
		tierlist.name = "";
	}

	let i = 0;
	for (const tier of tierlist.tiers) {
		if (tier.champions == undefined) {
			tier.champions = [];
			console.warn(
				"Couldn't read the tier champions array, assigning empty array",
			);
		}
		if (tier.name == undefined) {
			throw `Tier name in the ${i + 1} tier is undefined`;
			return default_tierlist;
		}
		if (tier.color == undefined) {
			tier.color = "limegreen";
			console.warn(
				"Couldn't read the tier color, assigning " + tier.color,
			);
		}

		tier.id = i;

		i += 1;
	}

	return tierlist;
}
