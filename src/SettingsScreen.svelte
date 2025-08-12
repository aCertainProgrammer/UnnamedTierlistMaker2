<script lang="ts">
	import { SaverLoader } from "./saverloader.svelte";
	import { program_state } from "./state.svelte";

	let settings = $state(SaverLoader.getSettings());
</script>

<div class="settings-screen">
	<div class="settings-top-buttons">
		<button
			class="text-button"
			onclick={() => {
				program_state.current_screen = "main_screen";
			}}>Close settings</button
		>
	</div>
	<div
		class="settings-content"
		role="none"
		onclick={() => {
			settings = SaverLoader.getSettings();
		}}
	>
		<button
			class="text-button {settings.disableDelete ? 'on' : 'off'}"
			onclick={() => {
				settings.disableDelete = !settings.disableDelete;
				SaverLoader.saveSettings(settings);
			}}>Stop delete from clearing the tierlist</button
		>
		<button
			class="text-button {settings.clearSearchBarsOnFocus ? 'on' : 'off'}"
			onclick={() => {
				settings.clearSearchBarsOnFocus =
					!settings.clearSearchBarsOnFocus;
				SaverLoader.saveSettings(settings);
			}}>Clear search bar on focus</button
		>
		<button
			class="text-button {settings.showChampionNamesOnHover
				? 'on'
				: 'off'}"
			onclick={() => {
				settings.showChampionNamesOnHover =
					!settings.showChampionNamesOnHover;
				SaverLoader.saveSettings(settings);
			}}>Show champion names on hover</button
		>
		<button
			class="text-button {settings.useLegacySearch ? 'on' : 'off'}"
			onclick={() => {
				settings.useLegacySearch = !settings.useLegacySearch;
				SaverLoader.saveSettings(settings);
			}}>Use legacy search</button
		>
		<button
			class="text-button {settings.appendToSnapshotsOnImport
				? 'on'
				: 'off'}"
			onclick={() => {
				settings.appendToSnapshotsOnImport =
					!settings.appendToSnapshotsOnImport;
				SaverLoader.saveSettings(settings);
			}}>Append to snapshots on import</button
		>
	</div>
</div>

<style>
	.settings-screen {
		height: 100%;
		width: 100%;
		max-height: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.settings-top-buttons {
		display: flex;
		flex-flow: row wrap;
		gap: 4px;
	}

	.settings-content {
		display: flex;
		flex-flow: column nowrap;
		align-items: start;
		height: 100%;
		width: 100%;

		gap: 10px;
		overflow: hidden;

		padding: 0px 30px;
	}
</style>
