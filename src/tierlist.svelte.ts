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
			name: "S",
			champions: [],
			color: "deepskyblue",
		},
		{
			name: "A",
			champions: [],
			color: "limegreen",
		},
		{
			name: "B",
			champions: [],
			color: "yellow",
		},
		{
			name: "C",
			champions: [],
			color: "orange",
		},
		{
			name: "F",
			champions: [],
			color: "tomato",
		},
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
