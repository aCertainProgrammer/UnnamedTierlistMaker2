import type { SaveData } from "./saverloader.svelte";
import { type TierlistType } from "./tierlist.svelte";

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

export const default_config: SaveData = {
	tierlist: JSON.parse(JSON.stringify(default_tierlist)),
	snapshots: [],
	items_per_page: 20,
	settings: {
		disableDelete: false,
		clearSearchBarsOnFocus: true,
		showChampionNamesOnHover: true,
		useLegacySearch: false,
		appendToSnapshotsOnImport: true,
	},
};
