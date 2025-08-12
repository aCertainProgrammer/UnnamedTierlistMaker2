<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import Tierlist from "./Tierlist.svelte";
	import { program_state } from "./state.svelte";
	import {
		getTierlist,
		resetTierlist,
		setTierlist,
		exportTierlist,
		importTierlist,
		useDraftPoolTemplate,
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
</script>

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
				console.log("Opening manual");
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
		<button onclick={useDraftPoolTemplate} class="text-button">
			Use draft pool template</button
		>
		<button
			class="text-button"
			onclick={() => {
				const tierlist = getTierlist();
				exportTierlist(tierlist);
			}}
		>
			Export tierlist</button
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
				program_state.export_pool_overlay_open = true;
			}}
		>
			Export draft pool</button
		>
		{#if program_state.export_pool_overlay_open}
			<ExportDraftPool />
		{/if}
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
		<button class="text-button" onclick={saveSnapshot}>Save snapshot</button
		>
		<button class="text-button" onclick={openSnapshotOverlay}
			>Open snapshots</button
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
