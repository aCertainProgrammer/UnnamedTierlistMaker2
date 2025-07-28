<script lang="ts">
	import { default_data } from "./default_data";
	import ChampionIcon from "./lib/ChampionIcon.svelte";
</script>

<div class="champions">
	{#each default_data as champion}
		<ChampionIcon {champion} />
	{/each}
</div>

<style>
	.champions {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		overflow-y: auto;
		min-height: 0;
		max-height: 100%;
	}
</style>
