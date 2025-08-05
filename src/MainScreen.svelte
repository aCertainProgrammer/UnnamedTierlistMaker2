<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import TextButton from "./lib/TextButton.svelte";
	import ImageButton from "./lib/ImageButton.svelte";
	import Tierlist from "./Tierlist.svelte";
	import { state } from "./state.svelte";
	import {
		getTierlist,
		resetTierlist,
		setTierlist,
		exportTierlist,
		validateTierlist,
		importTierlist,
	} from "./tierlist.svelte";
	import { exportTierlistAsImage } from "./images.svelte";
	import { readFile } from "./util";
	import type { FormEventHandler } from "svelte/elements";

	function takeScreenshot() {
		const tierlist = getTierlist();
		exportTierlistAsImage(tierlist);
	}

	function madeDraftPoolTemplate() {
		const tierlist = getTierlist();
		let five_tiers = tierlist.tiers.slice(0, 5);

		const tier_names = [
			"Toplane",
			"Jungle",
			"Midlane",
			"Botlane",
			"Support",
		];
		five_tiers.forEach((current, index) => {
			current.name = tier_names[index];
		});

		tierlist.tiers = five_tiers;

		setTierlist(tierlist);
	}

	async function wrapImportTierlist(event: any) {
		if (event.target.files == null || event.target.files.length == 0) {
			console.error("Files null when they shouldn't be");
			return;
		}

		importTierlist(event.target.files[0]);
	}
</script>

<div class="main-content">
	<div class="top-buttons">
		<ImageButton
			src="./img/settings-cog.webp"
			alt="Open settings button"
			onclick={() => {
				state.current_screen = "settings_screen";
			}}
		/>
		<ImageButton
			src="./img/question-mark.webp"
			alt="Open manual button"
			onclick={() => {
				console.log("Opening manual");
			}}
		/>
		<ImageButton
			src="./img/screenshot.webp"
			alt="Take screenshot button"
			onclick={takeScreenshot}
		/>
		<TextButton
			text="Reset tierlist"
			onclick={() => {
				resetTierlist();
			}}
		/>
		<TextButton
			text="Use draft pool template"
			onclick={madeDraftPoolTemplate}
		/>
		<TextButton
			text="Export tierlist"
			onclick={() => {
				const tierlist = getTierlist();
				exportTierlist(tierlist);
			}}
		/>
		<TextButton
			text="Import tierlist"
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
		/>
		<input
			style="display:none"
			type="file"
			oninput={wrapImportTierlist}
			id="import-tierlist-file-input"
		/>
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
	}

	.top-buttons {
		display: flex;
	}

	.middle-container {
		display: flex;
		align-items: center;
		height: 100%;
		width: 100%;

		gap: 40px;
		overflow: hidden;
	}
</style>
