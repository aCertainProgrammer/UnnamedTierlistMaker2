<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import Tierlist from "./Tierlist.svelte";
	import { program_state } from "./state.svelte";
	import { first_champion } from "./filtering.svelte";
	import {
		getTierlist,
		resetTierlist,
		exportTierlist,
		importTierlist,
		useDraftPoolTemplate,
		clearAllTiers,
		pickChampion,
	} from "./tierlist.svelte";
	import { exportTierlistAsImage } from "./images.svelte";
	import ExportDraftPool from "./ExportDraftPool.svelte";
	import { SaverLoader } from "./saverloader.svelte";
	import SnapshotsOverlay from "./SnapshotsOverlay.svelte";
	import ImportDraftPool from "./ImportDraftPool.svelte";

	function takeScreenshot() {
		const tierlist = getTierlist();
		exportTierlistAsImage(tierlist);
	}

	async function wrapImportTierlist(event: any) {
		if (event.target.files == null || event.target.files.length == 0) {
			console.error("Files null when they shouldn't be");
			return;
		}

		importTierlist(event.target.files[0]);
	}

	function openSnapshotOverlay() {
		program_state.snapshot_overlay_open = true;
	}

	function saveSnapshot() {
		const tierlist = getTierlist();
		SaverLoader.saveSnapshot(tierlist);
	}

	function onkeydown(event: KeyboardEvent) {
		if (program_state.current_screen != "main_screen") {
			return;
		}

		if (
			program_state.snapshot_overlay_open ||
			program_state.tier_editor_open ||
			program_state.export_pool_overlay_open ||
			program_state.import_pool_overlay_open
		) {
			return;
		}

		event.stopPropagation();

		const key = event.key.toLowerCase();
		const isShiftKeyPressed = event.shiftKey;
		const settings = SaverLoader.getSettings();

		//let isLetter = false;
		let isNumber = false;

		//const letterRegex = /^[A-Za-z]$/;
		//if (key.match(letterRegex)) {
		//	isLetter = true;
		//}

		const numberRegex = /^[0-9]$/;
		if (key.match(numberRegex)) {
			isNumber = true;
		}

		const tierlistNameInput = document.getElementById(
			"tierlist-name-input",
		) as HTMLInputElement;

		const championSelectionSearchBar = document.getElementById(
			"champion-selection-search-bar",
		) as HTMLInputElement;

		if (tierlistNameInput == null) {
			console.error("tierlistNameInput is null!");
			return;
		}
		if (championSelectionSearchBar == null) {
			console.error("championSelectionSearchBar is null!");
			return;
		}

		const toplaneRoleFilteringButton = document.getElementById(
			"top-filtering-button",
		);
		const jungleRoleFilteringButton = document.getElementById(
			"jungle-filtering-button",
		);
		const midlaneRoleFilteringButton = document.getElementById(
			"mid-filtering-button",
		);
		const botlaneRoleFilteringButton = document.getElementById(
			"adc-filtering-button",
		);
		const supportRoleFilteringButton = document.getElementById(
			"support-filtering-button",
		);

		if (toplaneRoleFilteringButton == null) {
			throw "toplaneRoleFilteringButton null when it shouldn't be";
		}
		if (jungleRoleFilteringButton == null) {
			throw "jungleRoleFilteringButton null when it shouldn't be";
		}
		if (midlaneRoleFilteringButton == null) {
			throw "midlaneRoleFilteringButton null when it shouldn't be";
		}
		if (botlaneRoleFilteringButton == null) {
			throw "botlaneRoleFilteringButton null when it shouldn't be";
		}
		if (supportRoleFilteringButton == null) {
			throw "supportRoleFilteringButton null when it shouldn't be";
		}

		if (document.activeElement == tierlistNameInput) {
			return;
		}

		if (key === "delete") {
			if (settings.disableDelete) {
				return;
			}

			clearAllTiers();
			championSelectionSearchBar.blur();
			return;
		} else if (key === "escape") {
			championSelectionSearchBar.value = "";
			championSelectionSearchBar.dispatchEvent(
				new Event("input", { bubbles: true }),
			);
			championSelectionSearchBar.blur();
			return;
		}

		if (isShiftKeyPressed) {
			if (
				key === settings.binds.toggleSnapshotOverlayBind.toLowerCase()
			) {
				const openSnapshotsButton = document.getElementById(
					"open-snapshots-button",
				);

				if (openSnapshotsButton == null) {
					throw "openSnapshotsButton null when it shouldn't be";
				}

				championSelectionSearchBar.blur();
				openSnapshotsButton.click();
				return;
			} else if (key === settings.binds.saveSnapshotBind.toLowerCase()) {
				const saveSnapshotButton = document.getElementById(
					"save-snapshot-button",
				);

				if (saveSnapshotButton == null) {
					throw "saveSnapshotButton null when it shouldn't be";
				}

				championSelectionSearchBar.blur();
				saveSnapshotButton.click();
				return;
			} else if (
				key === settings.binds.toggleToplaneFilterBind.toLowerCase()
			) {
				championSelectionSearchBar.blur();
				toplaneRoleFilteringButton.click();
				return;
			} else if (
				key === settings.binds.toggleJungleFilterBind.toLowerCase()
			) {
				championSelectionSearchBar.blur();
				jungleRoleFilteringButton.click();
				return;
			} else if (
				key === settings.binds.toggleMidlaneFilterBind.toLowerCase()
			) {
				championSelectionSearchBar.blur();
				midlaneRoleFilteringButton.click();
				return;
			} else if (
				key === settings.binds.toggleBotlaneFilterBind.toLowerCase()
			) {
				championSelectionSearchBar.blur();
				botlaneRoleFilteringButton.click();
				return;
			} else if (
				key === settings.binds.toggleSupportFilterBind.toLowerCase()
			) {
				championSelectionSearchBar.blur();
				supportRoleFilteringButton.click();
				return;
			}
		} else {
			if (isNumber) {
				championSelectionSearchBar.blur();

				const champion = first_champion;
				if (champion == null) {
					return;
				}

				pickChampion(champion, Number(key) - 1);
			} else if (document.activeElement != championSelectionSearchBar) {
				if (settings.clearSearchBarsOnFocus) {
					championSelectionSearchBar.value = "";
				}
				championSelectionSearchBar.focus();
			}
		}
	}
</script>

<svelte:window {onkeydown} />
<div class="main-content">
	<div class="top-buttons">
		<button
			class="image-button"
			onclick={() => {
				program_state.current_screen = "settings_screen";
			}}
			><img src="./img/settings-cog.webp" alt="Open settings button" />
		</button>

		<button
			class="image-button"
			onclick={() => {
				program_state.current_screen = "manual_screen";
			}}
		>
			<img src="./img/question-mark.webp" alt="Open manual button" />
		</button>

		<button class="image-button" onclick={takeScreenshot}>
			<img src="./img/screenshot.webp" alt="Take screenshot button" />
		</button>
		<button
			class="text-button"
			onclick={() => {
				resetTierlist();
			}}
		>
			Reset tierlist</button
		>
		<button
			class="text-button"
			onclick={() => {
				const fileInput = document.getElementById(
					"import-tierlist-file-input",
				);

				if (fileInput == null) {
					console.error("fileInput null when it shouldn't be");
					return;
				}

				fileInput.click();
			}}
		>
			Import tierlist</button
		>
		<input
			style="display:none"
			type="file"
			oninput={wrapImportTierlist}
			id="import-tierlist-file-input"
		/>
		<button
			class="text-button"
			onclick={() => {
				const tierlist = getTierlist();
				exportTierlist(tierlist);
			}}
		>
			Export tierlist</button
		>
		<button onclick={useDraftPoolTemplate} class="text-button">
			Use draft pool template</button
		>
		<button
			class="text-button"
			onclick={() => {
				program_state.import_pool_overlay_open = true;
			}}
		>
			Import draft pool</button
		>
		{#if program_state.import_pool_overlay_open}
			<ImportDraftPool />
		{/if}
		<button
			class="text-button"
			onclick={() => {
				program_state.export_pool_overlay_open = true;
			}}
		>
			Export draft pool</button
		>
		{#if program_state.export_pool_overlay_open}
			<ExportDraftPool />
		{/if}
		<button
			id="save-snapshot-button"
			class="text-button"
			onclick={saveSnapshot}>Save snapshot</button
		>
		<button
			id="open-snapshots-button"
			class="text-button"
			onclick={openSnapshotOverlay}>Open snapshots</button
		>
		{#if program_state.snapshot_overlay_open}<SnapshotsOverlay />{/if}
	</div>
	<div class="middle-container">
		<Tierlist />
		<ChampionSelection />
	</div>
</div>

<style>
	.main-content {
		height: 100%;
		width: 100%;
		max-height: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.top-buttons {
		display: flex;
		flex-flow: row wrap;
		gap: 4px;
	}

	.middle-container {
		display: flex;
		align-items: center;
		height: 100%;
		width: 100%;

		gap: 100px;
		overflow: hidden;

		padding: 0px 30px;
	}
</style>
