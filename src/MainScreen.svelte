<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import TextButton from "./lib/TextButton.svelte";
	import ImageButton from "./lib/ImageButton.svelte";
	import Tierlist from "./Tierlist.svelte";
	import { state } from "./state.svelte";
	import { resetTierlist } from "./tierlist.svelte";
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
			onclick={() => {
				console.log("Taking a screenshot");
			}}
		/>
		<TextButton
			text="Reset tierlist"
			onclick={() => {
				resetTierlist();
			}}
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

		overflow: hidden;
	}
</style>
