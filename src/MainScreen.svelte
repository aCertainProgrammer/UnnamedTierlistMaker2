<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import TextButton from "./lib/TextButton.svelte";
	import Tierlist from "./Tierlist.svelte";
	import { state } from "./state.svelte";
</script>

<div class="main-content">
	<div class="top-buttons">
		<TextButton
			text="Open settings"
			onclick={() => {
				state.current_screen = "settings_screen";
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
