<script lang="ts">
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import type { TierType } from "./tierlist.svelte";

	type Props = {
		tier: TierType;
	};

	const { tier }: Props = $props();
	$inspect(tier);
</script>

<div class="tier">
	<div class="tier-name" style="background: {tier.color};">
		<span>{tier.name}</span>
	</div>
	<div class="tier-champions">
		{#each tier.champions as champion}
			<ChampionIcon {champion} />
		{/each}
	</div>
</div>

<style>
	.tier {
		min-height: var(--championIconWidth);
		width: 100%;

		display: flex;
		border: 1px solid black;
	}

	.tier-name {
		min-width: calc(1.5 * var(--championIconWidth));
		width: calc(1.5 * var(--championIconWidth));

		display: flex;
		justify-content: center;
		align-items: center;

		border-left: 1px solid black;
	}

	.tier-name > span {
		color: black;
		font-size: 1.3rem;
		text-align: center;
		word-break: break-all;
	}

	.tier-champions {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;

		padding: 2px 4px;
		min-height: var(--championIconWidth);

		background: #0a0440;
		flex: 1;
	}
</style>
