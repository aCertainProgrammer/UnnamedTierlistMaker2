<script lang="ts">
	import MainScreen from "./MainScreen.svelte";
	import SettingsScreen from "./SettingsScreen.svelte";
	import { program_state } from "./state.svelte";

	function onkeydown(event: KeyboardEvent) {
		event.stopPropagation();
		const key = event.key;

		if (program_state.export_pool_overlay_open) {
			return;
		}

		if (program_state.tier_editor_open) {
			if (key == "Escape") {
				program_state.tier_editor_open = false;
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

				if (event.key == "Escape") {
					championSelectionSearchBar.value = "";
					championSelectionSearchBar.dispatchEvent(
						new Event("input", { bubbles: true }),
					);
					championSelectionSearchBar.blur();
				} else if (
					document.activeElement != championSelectionSearchBar
				) {
					championSelectionSearchBar.value = "";
					championSelectionSearchBar.focus();
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
