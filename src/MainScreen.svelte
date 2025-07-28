<script lang="ts">
	import ChampionSelection from "./ChampionSelection.svelte";
	import TextButton from "./lib/TextButton.svelte";
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
		<ChampionSelection />
		<div class="champion-selection">champion-selection</div>
	</div>
</div>

<style>
	.main-content {
		height: 100vh;
		width: 100vw;
		max-height: 100vh;
		max-width: 100vw;
		display: flex;
		flex-direction: column;
	}

	.top-buttons {
		display: flex;
	}

	.middle-container {
		display: flex;
		align-items: center;
	}
</style>
