import { SaverLoader, type Snapshot } from "./saverloader.svelte";
import { exportData, readFile } from "./util";
import { udt1_default_data } from "./UDT1_default_data";
import { default_tierlist } from "./defaults.svelte";

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

export type DraftPoolTeam = "ally" | "enemy" | "all" | null;

export const all_colors: Array<TierColorType> = [
	"tomato",
	"deepskyblue",
	"limegreen",
	"greenyellow",
	"yellow",
	"orange",
];

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

type ChampionPool = {
	top: Array<String>;
	jungle: Array<String>;
	mid: Array<String>;
	adc: Array<String>;
	support: Array<String>;
};

type UDT1Data = {
	all: ChampionPool;
	ally: ChampionPool;
	enemy: ChampionPool;
};

export function exportDraftPool(
	tierlist: TierlistType,
	team: DraftPoolTeam,
): void {
	const pool: ChampionPool = {
		top: tierlist.tiers[0].champions,
		jungle: tierlist.tiers[1].champions,
		mid: tierlist.tiers[2].champions,
		adc: tierlist.tiers[3].champions,
		support: tierlist.tiers[4].champions,
	};

	if (team == null) {
		exportData(pool, "pool.json");
		return;
	}

	const UDT1_USERDATA_LOCALSTORAGE_STRING = "user_data";

	const user_json = localStorage.getItem(UDT1_USERDATA_LOCALSTORAGE_STRING);

	let data: UDT1Data = udt1_default_data;
	data = udt1_default_data;

	if (user_json != null) {
		try {
			data = JSON.parse(user_json);
		} catch (e) {
			console.error(e);
		}
	}

	if (data == null) {
		console.error("Failed to retrieve or construct UDT1 data");
	}

	data[team] = pool;
	try {
		localStorage.setItem(
			UDT1_USERDATA_LOCALSTORAGE_STRING,
			JSON.stringify(data),
		);
	} catch (e) {
		console.error(e);
	}
}

export function changeSnapshotName(name: string, id: number) {
	const snapshots = SaverLoader.getSnapshots();
	const snapshot = snapshots.find((current) => current.id === id);

	if (snapshot == null) {
		throw "Couldn't find snapshot to edit";
		return;
	}
	snapshot.tierlist.name = name;

	SaverLoader.saveSnapshots(snapshots);
}

export function loadSnapshot(id: number) {
	const snapshot = getSnapshotById(id);

	if (snapshot == null) {
		throw "Snapshot is null";
		return;
	}

	setTierlist(snapshot.tierlist);
}

export function removeSnapshot(id: number) {
	try {
		const snapshot = getSnapshotById(id);

		if (snapshot == null) {
			throw "Snapshot is null";
			return;
		}

		const snapshots = SaverLoader.getSnapshots();
		snapshots.splice(
			snapshots.findIndex((current) => snapshot.id === current.id),
			1,
		);

		SaverLoader.saveSnapshots(snapshots);
	} catch (e) {
		console.error(e);
	}
}

export function getSnapshotById(id: number): Snapshot {
	const snapshots = SaverLoader.getSnapshots();
	const snapshot = snapshots.find((current) => current.id === id);

	if (snapshot == null) {
		throw "Snapshot not found, id: " + id;
	}

	return snapshot;
}
