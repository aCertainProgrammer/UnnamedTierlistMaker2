import type { TierlistType } from "./tierlist.svelte";
import { default_tierlist } from "./tierlist.svelte";

const local_storage_string = "UTM2";
const tierlist_string = "tierlist";

export type Snapshot = {
	tierlist: TierlistType;
	id: number;
};
export type Snapshots = Array<Snapshot>;

export type SaveData = {
	tierlist: TierlistType;
	snapshots: Snapshots;
};
export class SaverLoader {
	static getSaveData(): SaveData {
		let json = localStorage.getItem(local_storage_string);
		try {
			if (json == null) {
				throw "localStorage JSON is null";
			}
			const data = JSON.parse(json);
			return data;
		} catch (e) {
			console.error(e);
			return {
				tierlist: JSON.parse(JSON.stringify(default_tierlist)),
				snapshots: [],
			};
		}
	}

	static saveAllData(save_data: SaveData) {
		if (save_data == null) {
			console.error("Null save_data passed!");
			return;
		}
		try {
			const json = JSON.stringify(save_data);
			localStorage.setItem(local_storage_string, json);
		} catch (e) {
			console.error(e);
		}
	}

	static saveTierlist(tierlist: TierlistType) {
		const save_data = this.getSaveData();
		save_data.tierlist = tierlist;

		this.saveAllData(save_data);
	}

	static getTierlist(): TierlistType {
		const save_data = this.getSaveData();
		if (save_data.tierlist == null) {
			save_data.tierlist = default_tierlist;
		}

		return save_data.tierlist;
	}

	static getSnapshots(): Snapshots {
		const save_data = this.getSaveData();
		return save_data.snapshots;
	}

	static saveSnapshot(tierlist: TierlistType): void {
		const save_data = this.getSaveData();
		if (save_data.snapshots == null) {
			save_data.snapshots = [];
		}

		const id =
			save_data.snapshots.length > 0
				? save_data.snapshots[save_data.snapshots.length - 1].id + 1
				: 0;
		const new_snapshot: Snapshot = {
			tierlist: tierlist,
			id: id,
		};

		save_data.snapshots.push(new_snapshot);

		this.saveAllData(save_data);
	}

	static updateSnapshots(snapshots: Snapshots) {
		if (snapshots == null) {
			throw "Null snapshots passed to update function";
			return;
		}

		const save_data = this.getSaveData();
		save_data.snapshots = snapshots;

		this.saveAllData(save_data);
	}
}
