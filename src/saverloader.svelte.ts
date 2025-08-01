import type { TierlistType } from "./tierlist.svelte";
import { default_tierlist } from "./tierlist.svelte";

const local_storage_string = "UTM2";
const tierlist_string = "tierlist";

export type SaveData = {
	tierlist: TierlistType;
};
export class SaverLoader {
	static getAllData(): SaveData {
		let json = localStorage.getItem(local_storage_string);
		try {
			if (json == null) {
				throw "localStorage JSON is null";
			}
			const data = JSON.parse(json);
			return data;
		} catch (e) {
			console.error(e);
			return { tierlist: JSON.parse(JSON.stringify(default_tierlist)) };
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
		const save_data = this.getAllData();
		save_data.tierlist = tierlist;

		this.saveAllData(save_data);
	}

	static getTierlist(): TierlistType {
		const save_data = this.getAllData();
		return save_data.tierlist;
	}
}
