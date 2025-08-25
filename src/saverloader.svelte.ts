import type { TierlistType } from "./tierlist.svelte";
import { default_config } from "./defaults.svelte";

const local_storage_string = "UTM2";

export type Snapshot = {
	tierlist: TierlistType;
	id: number;
};
export type Snapshots = Array<Snapshot>;

export type Theme = "legacy-dark" | "modern-dark";

export type Settings = {
	disableDelete: boolean;
	clearSearchBarsOnFocus: boolean;
	showChampionNamesOnHover: boolean;
	useLegacySearch: boolean;
	appendToSnapshotsOnImport: boolean;
	theme: Theme;
	binds: Binds;
};

export type SaveData = {
	tierlist: TierlistType;
	snapshots: Snapshots;
	items_per_page: number;
	settings: Settings;
};

export type Bind = string;

export type Binds = {
	toggleToplaneFilterBind: Bind;
	toggleJungleFilterBind: Bind;
	toggleMidlaneFilterBind: Bind;
	toggleBotlaneFilterBind: Bind;
	toggleSupportFilterBind: Bind;
	toggleSnapshotOverlayBind: Bind;
	saveSnapshotBind: Bind;
	prepMacroBind: Bind;
};

export class SaverLoader {
	static getAllThemes(): Array<Theme> {
		return ["legacy-dark", "modern-dark"];
	}

	static getSaveData(): SaveData {
		const json = localStorage.getItem(local_storage_string);
		try {
			if (json == null) {
				throw "localStorage JSON is null, loading default config";
			}
			const data = JSON.parse(json);
			return data;
		} catch (e) {
			console.error(e);
			this.saveAllData(default_config);
			return default_config;
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
			console.warn(
				"Couldn't read save_data.tierlist, using default value",
			);
			save_data.tierlist = JSON.parse(
				JSON.stringify(default_config.tierlist),
			);
			this.saveTierlist(default_config.tierlist);
		}

		return save_data.tierlist;
	}

	static getSnapshots(): Snapshots {
		const save_data = this.getSaveData();

		if (save_data.snapshots == null) {
			console.warn(
				"Couldn't read save_data.snapshots, using default value",
			);

			save_data.snapshots = JSON.parse(
				JSON.stringify(default_config.snapshots),
			);
			this.saveAllData(save_data);
		}

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

	static saveSnapshots(snapshots: Snapshots) {
		if (snapshots == null) {
			throw "Null snapshots passed to update function";
			return;
		}

		const save_data = this.getSaveData();
		save_data.snapshots = snapshots;

		this.saveAllData(save_data);
	}

	static getItemsPerPage(): number {
		const save_data = this.getSaveData();

		if (save_data.items_per_page == null) {
			console.warn(
				"Couldn't read save_data.items_per_page, using default value",
			);
			save_data.items_per_page = default_config.items_per_page;
			this.saveItemsPerPage(default_config.items_per_page);
		}

		return save_data.items_per_page;
	}

	static saveItemsPerPage(x: number): void {
		const save_data = this.getSaveData();
		save_data.items_per_page = x;

		this.saveAllData(save_data);
	}

	static getSettings(): Settings {
		const save_data = this.getSaveData();
		const valid_settings = this.validateSettings(save_data.settings);

		this.saveSettings(valid_settings);
		return valid_settings;
	}

	static validateSettings(settings: Settings): Settings {
		if (settings == null) {
			console.warn(
				"Couldn't read the program settings, using the default ones",
			);
			this.saveSettings(default_config.settings);
			return default_config.settings;
		}

		(
			Object.keys(default_config.settings) as Array<
				keyof typeof default_config.settings
			>
		).forEach((property) => {
			if (settings[property] == null) {
				settings[property] = default_config.settings[property];
			}
		});

		settings.binds = this.validateBinds(settings.binds);

		return settings;
	}

	static saveSettings(settings: Settings) {
		const save_data = this.getSaveData();
		const valid_settings = this.validateSettings(settings);

		save_data.settings = valid_settings;
		this.saveAllData(save_data);
	}

	static getTheme(): Theme {
		const settings = this.getSettings();
		if (settings.theme == null) {
			settings.theme = default_config.settings.theme;
			this.saveSettings(settings);

			return settings.theme;
		}

		return settings.theme;
	}

	static getBinds(): Binds {
		const settings = this.getSettings();
		if (settings.binds == null) {
			settings.binds = JSON.parse(
				JSON.stringify(default_config.settings.binds),
			);

			this.saveSettings(settings);

			return settings.binds;
		}

		const valid_binds = this.validateBinds(settings.binds);
		this.saveSettings(settings);
		return valid_binds;
	}

	static resetBinds(): void {
		const settings = this.getSettings();
		settings.binds = JSON.parse(
			JSON.stringify(default_config.settings.binds),
		);

		this.saveSettings(settings);
	}

	static validateBinds(binds: Binds): Binds {
		if (binds == null) {
			console.warn(
				"couldnt read binds in validateBinds, using default ones",
			);

			return default_config.settings.binds;
		}

		for (const property in default_config.settings.binds) {
			if (binds[property] == null) {
				binds[property] = default_config.settings.binds[property];
			}
		}

		return binds;
	}

	static getAllPageCounterOptions(): Array<number> {
		return [20, 50, 100];
	}
}
