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
		justify-content: center;
		align-items: start;

		gap: 2px;

		overflow-y: auto;

		width: 50%;
		max-height: 100%;
		padding-top: 20px;
		padding-bottom: 10px;
	}
</style>
