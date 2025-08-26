<script lang="ts">
	import { default_config } from "./defaults.svelte";
	import { SaverLoader } from "./saverloader.svelte";
	import { program_state } from "./state.svelte";

	let settings = $state(SaverLoader.getSettings());
	let bindsArray = $derived.by(() => {
		const binds = settings.binds;

		return [
			{
				property: "saveSnapshotBind",
				bind: binds.saveSnapshotBind,
				text: "Save snapshots",
			},
			{
				property: "toggleSnapshotOverlayBind",
				bind: binds.toggleSnapshotOverlayBind,
				text: "Show/hide snapshots",
			},
			{
				property: "toggleToplaneFilterBind",
				bind: binds.toggleToplaneFilterBind,
				text: "Toggle toplane champions filter",
			},
			{
				property: "toggleJungleFilterBind",
				bind: binds.toggleJungleFilterBind,
				text: "Toggle jungle champions filter",
			},
			{
				property: "toggleMidlaneFilterBind",
				bind: binds.toggleMidlaneFilterBind,
				text: "Toggle midlane champions filter",
			},
			{
				property: "toggleBotlaneFilterBind",
				bind: binds.toggleBotlaneFilterBind,
				text: "Toggle botlane champions filter",
			},
			{
				property: "toggleSupportFilterBind",
				bind: binds.toggleSupportFilterBind,
				text: "Toggle support champions filter",
			},
			{
				property: "prepMacroBind",
				bind: binds.prepMacroBind,
				text: "Take screenshot + export tierlist + open draft pool export modal",
			},
			{
				property: "takeScreenshotBind",
				bind: binds.takeScreenshotBind,
				text: "Take screenshot",
			},
		];
	});

	let disabledDefault = $derived.by(() => {
		const default_binds = default_config.settings.binds;

		for (const bind_element of bindsArray) {
			if (bind_element.bind != default_binds[bind_element.property]) {
				console.log("not default");
				return false;
			}
		}

		return true;
	});

	function setTheme(event: any) {
		if (event.target == null) {
			throw "Theme picker null when it shouldn't be";
		}

		settings.theme = event.target.value;
		SaverLoader.saveSettings(settings);

		document.documentElement.dataset.theme = settings.theme;
	}
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
		<div class="settings-column">
			<div class="settings-column-title">Program behaviour</div>
			<div class="settings-column-content">
				<button
					class="text-button {settings.disableDelete ? 'on' : 'off'}"
					onclick={() => {
						settings.disableDelete = !settings.disableDelete;
						SaverLoader.saveSettings(settings);
					}}>Stop delete from clearing the tierlist</button
				>
				<button
					class="text-button {settings.clearSearchBarsOnFocus
						? 'on'
						: 'off'}"
					onclick={() => {
						settings.clearSearchBarsOnFocus =
							!settings.clearSearchBarsOnFocus;
						SaverLoader.saveSettings(settings);
					}}>Clear search bars on focus</button
				>
				<button
					class="text-button {settings.useLegacySearch
						? 'on'
						: 'off'}"
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
		<div class="settings-column">
			<div class="settings-column-title">Looks</div>
			<div class="settings-column-content">
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
				<select oninput={setTheme} bind:value={settings.theme}>
					{#each SaverLoader.getAllThemes() as theme}
						<option value={theme}>Theme: {theme}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="settings-column">
			<div class="settings-column-title">Keybinds</div>
			<div class="settings-column-content">
				<div>
					All of the keybinds in here require <span
						style="color:lightgreen">Shift</span
					> to be pressed in order to work
				</div>

				{#each bindsArray as bind_data (bind_data.property)}
					<div class="bind-container">
						<div>{bind_data.text}</div>
						<input
							type="text"
							class="text-input"
							maxlength="1"
							value={bind_data.bind.toUpperCase()}
							oninput={(event: any) => {
								const bind = event.target.value.toUpperCase();
								if (bind.lenght < 1) {
									return;
								}

								settings.binds[bind_data.property] = bind;
								SaverLoader.saveSettings(settings);
							}}
						/>
					</div>
				{/each}
				<button
					disabled={disabledDefault}
					class="text-button"
					onclick={() => SaverLoader.resetBinds()}
					>Reset binds to default</button
				>
			</div>
		</div>
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
		flex-flow: row nowrap;
		align-items: start;
		height: 100%;
		width: 100%;

		gap: 10px;
		overflow: hidden;

		padding: 0px 30px;
	}

	.settings-column {
		height: 100%;

		width: 33%;

		display: flex;
		flex-flow: column nowrap;
		align-items: start;
		justify-content: start;

		gap: 10px;
	}

	.settings-column-title {
		height: 30px;
		width: 100%;

		font-size: 20px;
		text-align: center;
	}

	.settings-column-content {
		height: 100%;
		width: 100%;

		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;

		gap: 10px;

		padding: 0px 10px;
	}

	.settings-column-content > * {
		width: 100%;
	}

	.bind-container {
		display: flex;
		flex-flow: row nowrap;
		gap: 10px;
	}

	.bind-container > div {
		width: 100%;
		display: flex;
	}

	.bind-container > input {
		width: 30px;
	}
</style>
