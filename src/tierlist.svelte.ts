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

const default_tierlist: TierlistType = {
	name: "Tierlist name",
	tiers: [
		{
			name: "S",
			champions: [
				"ahri",
				"renekton",
				"ahri",
				"renekton",
				"ahri",
				"renekton",
				"ahri",
				"renekton",
			],
			color: "deepskyblue",
		},
		{
			name: "A very long and interesting name that stretches",
			champions: ["ahri", "renekton"],
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

let tierlist: TierlistType = $state(default_tierlist);

export function getTierlist(): TierlistType {
	return tierlist;
}

export function setTierlist(t: TierlistType): void {
	tierlist = t;
}

export function clearTierlist(): void {
	tierlist = {
		name: tierlist.name,
		tiers: default_tierlist.tiers,
	};
}
