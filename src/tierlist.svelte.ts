import { SaverLoader } from "./saverloader.svelte";
import type { Snapshot, Snapshots } from "./saverloader.svelte";
import { exportData, readFile } from "./util";
import { udt1_default_data } from "./UDT1_default_data";
import { default_config, default_tierlist } from "./defaults.svelte";
import { exportTierlistAsImage } from "./images.svelte";
import { all_champions } from "./filtering.svelte";
import { default_data } from "./default_data";

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

export type ChampionDataSource = "tier" | "champion_selection";

export type ChampionDragDataType = {
	champion: string;
	source: ChampionDataSource;
	tier_id?: number | undefined;
};

export type DraftPoolTeam = "ally" | "enemy" | "all" | null;

export const all_colors: Array<TierColorType> = [
	"tomato",
	"deepskyblue",
	"limegreen",
	"greenyellow",
	"yellow",
	"orange",
];

export function getRandomColor(): TierColorType {
	const max = all_colors.length - 1;

	let index = Math.round(Math.random() * max);
	if (index > max) {
		index = max;
	}

	return all_colors[index];
}

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
	top: Array<string>;
	jungle: Array<string>;
	mid: Array<string>;
	adc: Array<string>;
	support: Array<string>;
};

type UDT1Data = {
	all: ChampionPool;
	ally: ChampionPool;
	enemy: ChampionPool;
};

const UDT1_USERDATA_LOCALSTORAGE_STRING = "user_data";
export function importDraftPool(team: DraftPoolTeam): void {
	if (team == null) {
		throw "Team is null when it shouldn't be";
	}

	const user_json = localStorage.getItem(UDT1_USERDATA_LOCALSTORAGE_STRING);

	if (user_json == null) {
		throw "Failed to retrieve UDT1 data, likely there are no custom champion pools set";
	}

	let data: UDT1Data;

	try {
		data = JSON.parse(user_json);
	} catch (e) {
		throw "Failed to parse draft pool data";
	}

	if (data == null) {
		throw "Failed to retrieve UDT1 data";
	}

	useDraftPoolTemplate();

	const team_data: ChampionPool = data[team];

	tierlist.tiers[0].champions = team_data["top"];
	tierlist.tiers[1].champions = team_data["jungle"];
	tierlist.tiers[2].champions = team_data["mid"];
	tierlist.tiers[3].champions = team_data["adc"];
	tierlist.tiers[4].champions = team_data["support"];

	setTierlist(tierlist);
}

export function exportDraftPool(
	tierlist: TierlistType,
	team: DraftPoolTeam,
): void {
	if (tierlist.tiers.length < 5) {
		throw "The tierlist is too short, please use the draft pool template";
	}

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

	const user_json = localStorage.getItem(UDT1_USERDATA_LOCALSTORAGE_STRING);

	let data: UDT1Data = udt1_default_data;

	if (user_json != null) {
		try {
			data = JSON.parse(user_json);
		} catch (e) {
			throw e;
		}
	}

	if (data == null) {
		throw "Failed to retrieve or construct UDT1 data";
	}

	data[team] = pool;
	try {
		localStorage.setItem(
			UDT1_USERDATA_LOCALSTORAGE_STRING,
			JSON.stringify(data),
		);
	} catch (e) {
		throw e;
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

export function removeTier(id: number): void {
	const filtered_tiers = tierlist.tiers.filter((tier) => tier.id !== id);

	filtered_tiers.forEach((tier, index) => (tier.id = index));

	tierlist.tiers = filtered_tiers;
	setTierlist(tierlist);
}

export function addTier() {
	const tierlist = getTierlist();
	const new_tier: TierType = {
		id: tierlist.tiers.length,
		name: getNewTierName(tierlist),
		champions: [],
		color: getRandomColor(),
	};

	tierlist.tiers.push(new_tier);
	setTierlist(tierlist);
}

export function exportSnapshots() {
	const snapshots = SaverLoader.getSnapshots();

	exportData(snapshots, "snapshots.json");
}

export async function importSnapshots(file: File): Promise<Snapshots | null> {
	let snapshots = SaverLoader.getSnapshots();
	const new_snapshots_json = await readFile(file);
	const settings = SaverLoader.getSettings();

	try {
		const new_snapshots = JSON.parse(new_snapshots_json);
		const validated_snapshots = validateSnapshots(
			new_snapshots,
			snapshots.length,
		);

		if (settings.appendToSnapshotsOnImport) {
			snapshots = [...snapshots, ...validated_snapshots];
		} else {
			snapshots = [...validated_snapshots];
		}
		SaverLoader.saveSnapshots(snapshots);
		return snapshots;
	} catch (e) {
		console.trace(e);
		return null;
	}
}

function validateSnapshots(
	snapshots: Snapshots,
	first_available_id: number,
): Snapshots {
	snapshots.forEach((snapshot, index) => {
		const id = first_available_id + index;
		snapshot.id = id;

		if (snapshot.tierlist == null) {
			console.warn(
				`Couldn't read tierlist in snapshot with id=${snapshot.id}`,
			);
			snapshot.tierlist = JSON.parse(JSON.stringify(default_tierlist));
		}
	});

	return snapshots;
}

export function screenshotAllSnapshots() {
	const snapshots = SaverLoader.getSnapshots();

	for (const snapshot of snapshots) {
		exportTierlistAsImage(snapshot.tierlist);
	}
}

export function clearAllSnapshots() {
	SaverLoader.saveSnapshots([]);
}

export function pickChampion(champion: string, index: number): void {
	if (index >= tierlist.tiers.length) {
		return;
	}

	tierlist.tiers[index].champions = tierlist.tiers[index].champions.filter(
		(picked_champion) => champion != picked_champion,
	);

	tierlist.tiers[index].champions.push(champion);
}

export function useDraftPoolTemplate() {
	const tierlist = getTierlist();
	const five_tiers: Array<TierType> = JSON.parse(
		JSON.stringify(default_tierlist.tiers),
	);

	while (five_tiers.length > 5) {
		five_tiers.pop();
	}

	const tier_names = ["Toplane", "Jungle", "Midlane", "Botlane", "Support"];
	five_tiers.forEach((current, index) => {
		current.name = tier_names[index];

		if (tierlist.tiers[index] != null) {
			current.champions = tierlist.tiers[index].champions;
		}
	});

	tierlist.tiers = five_tiers;

	setTierlist(tierlist);
}

export function clearAllTiers() {
	tierlist.tiers.forEach((tier) => {
		tier.champions = [];
	});

	setTierlist(tierlist);
}

export function importPoolFromOpgg(text: string) {
	resetTierlist();
	useDraftPoolTemplate();

	const words = text.split(/\s/).filter((word) => word.length != 0);
	const tiers: any = [
		{ champions: [] },
		{ champions: [] },
		{ champions: [] },
		{ champions: [] },
		{ champions: [] },
	];

	let tierIndex = -1;
	for (let i = 0; i < words.length; i++) {
		const word = words[i];

		if (word.includes("#")) {
			tierIndex += 1;
		}

		let champion = word.replace(/'/g, "");
		champion = champion.toLowerCase();

		if (champion == "mundo") {
			champion = "drmundo";
		} else if (champion == "fortune") {
			champion = "missfortune";
		} else if (champion == "sin") {
			champion = "leesin";
		} else if (champion == "zhao") {
			champion = "xinzhao";
		} else if (champion == "sol") {
			champion = "aurelionsol";
		} else if (champion == "kench") {
			champion = "tahmkench";
		} else if (champion == "fate") {
			champion = "twistedfate";
		} else if (champion == "yi") {
			champion = "masteryi";
		}

		if (
			all_champions.includes(champion) &&
			(words[i + 2] == "KDA" || words[i + 3] == "KDA")
		) {
			tiers[tierIndex].champions.push(champion);
		}
	}

	const roleTiers = [
		default_data.top,
		default_data.jungle,
		default_data.mid,
		default_data.adc,
		default_data.support,
	];

	const tierCounters = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];
	for (let j = 0; j < tierCounters.length; j++) {
		for (const champion of tiers[j].champions) {
			for (let i = 0; i < roleTiers.length; i++) {
				if (roleTiers[i].includes(champion)) {
					tierCounters[j][i] += 1;
				}
			}
		}
	}

	for (let roleIndex = 0; roleIndex < tierCounters.length; roleIndex++) {
		let max = -1;
		let maxIndex = -1;
		for (let i = 0; i < tiers.length; i++) {
			if (tierCounters[i][roleIndex] > max) {
				max = tierCounters[i][roleIndex];
				maxIndex = i;
			}
		}

		tierlist.tiers[roleIndex].champions = tiers[maxIndex].champions;
		tierCounters[maxIndex] = [-1, -1, -1, -1, -1];
	}

	setTierlist(tierlist);
}
