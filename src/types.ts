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
