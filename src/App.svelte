<script lang="ts">
	import { setContext } from "svelte";
	import MainScreen from "./MainScreen.svelte";
	import SettingsScreen from "./SettingsScreen.svelte";
	import { program_state } from "./state.svelte";
	import { clearAllTiers, pickChampion } from "./tierlist.svelte";
	import { first_champion } from "./filtering.svelte";
	import { SaverLoader } from "./saverloader.svelte";

	setContext("role-filter", "none");

	function onkeydown(event: KeyboardEvent) {
		event.stopPropagation();
		const key = event.key;
		const settings = SaverLoader.getSettings();

		let isLetter = false;
		let isNumber = false;

		const letterRegex = /^[A-Za-z]$/;
		if (key.match(letterRegex)) {
			isLetter = true;
		}
		const numberRegex = /^[0-9]$/;
		if (key.match(numberRegex)) {
			isNumber = true;
		}

		if (program_state.import_pool_overlay_open) {
			return;
		}

		if (program_state.export_pool_overlay_open) {
			return;
		}

		if (program_state.snapshot_overlay_open) {
			const snapshotSearchBar = document.getElementById(
				"snapshots-search-bar",
			) as HTMLInputElement;

			if (
				document.activeElement?.classList.contains(
					"tierlist-name-preview",
				)
			) {
				return;
			} else if (key == "Escape") {
				snapshotSearchBar.value = "";
				snapshotSearchBar.dispatchEvent(
					new Event("input", { bubbles: true }),
				);
				snapshotSearchBar.blur();
			} else if (document.activeElement != snapshotSearchBar) {
				snapshotSearchBar.value = "";
				snapshotSearchBar.focus();
			}

			return;
		}

		if (program_state.tier_editor_open) {
			const tierNameInput = document.getElementById(
				"tier-name-input",
			) as HTMLInputElement;
			if (tierNameInput == null) {
				console.error("tierNameInput null when it shouldn't be");
				return;
			}

			if (key == "Escape") {
				program_state.tier_editor_open = false;
			} else if (document.activeElement != tierNameInput) {
				tierNameInput.value = "";
				tierNameInput.dispatchEvent(
					new Event("input", { bubbles: true }),
				);
				tierNameInput.focus();
			}

			return;
		}

		switch (program_state.current_screen) {
			case "main_screen": {
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

				if (document.activeElement == tierlistNameInput) {
					return;
				}

				switch (event.key) {
					case "Delete": {
						if (settings.disableDelete) {
							break;
						}

						clearAllTiers();
						championSelectionSearchBar.blur();
						break;
					}
					case "Escape": {
						championSelectionSearchBar.value = "";
						championSelectionSearchBar.dispatchEvent(
							new Event("input", { bubbles: true }),
						);
						championSelectionSearchBar.blur();
						break;
					}
					default: {
						if (isNumber) {
							championSelectionSearchBar.blur();

							const champion = first_champion;
							if (champion == null) {
								return;
							}

							pickChampion(champion, Number(key) - 1);
						} else if (
							document.activeElement != championSelectionSearchBar
						) {
							championSelectionSearchBar.value = "";
							championSelectionSearchBar.focus();
						}
					}
				}

				break;
			}
		}
	}

	document.body.addEventListener("keydown", onkeydown);
</script>

<main>
	{#if program_state.current_screen == "main_screen"}
		<MainScreen />
	{:else if program_state.current_screen == "settings_screen"}
		<SettingsScreen />
	{/if}
</main>

<style>
	main {
		height: 100%;
		width: 100%;
		max-height: 100%;
		max-width: 100%;
	}
</style>
