import { SaverLoader } from "./saverloader.svelte";

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
