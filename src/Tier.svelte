<script lang="ts">
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import { dndzone, TRIGGERS } from "svelte-dnd-action";
	import type { ChampionDragDataType, TierType } from "./tierlist.svelte";

	type Props = {
		tier: TierType;
		tier_id: number;
	};

	const { tier, tier_id }: Props = $props();

	let items = $derived.by(() => {
		const arr = [];
		for (let i = 0; i < tier.champions.length; i++) {
			arr.push({
				id: `id_${i}_of_champ_${tier.champions[i]}_in_tier_${tier_id}`,
				champion: tier.champions[i],
			});
		}

		return arr;
	});

	function handleDndConsider(e: any) {
		const { trigger, id } = e.detail.info;
		if (trigger === TRIGGERS.DRAG_STARTED) {
			const index = items.findIndex((item) => item.id === id);
			const new_id = `${id}_copy_${Math.round(Math.random() * 1000000)}`;

			e.detail.items.splice(index, 0, { ...items[index], id: new_id });
		}

		items = e.detail.items;
	}

	function handleDndFinalize(e: any) {
		items = e.detail.items;
	}
</script>

<div class="tier">
	<div class="tier-name" style="background: {tier.color};">
		<span>{tier.name}</span>
	</div>
	<div
		class="tier-champions"
		use:dndzone={{ items, dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<ChampionIcon champion={item.champion} source="tier" {tier_id} />
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
