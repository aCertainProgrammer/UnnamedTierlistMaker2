<script lang="ts">
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import { dndzone, TRIGGERS } from "svelte-dnd-action";
	import {
		getTierlist,
		setTierlist,
		type TierlistType,
		type TierType,
	} from "./tierlist.svelte";

	type Props = {
		tier_id: number;
	};

	const { tier_id }: Props = $props();
	let tierlist: TierlistType = $derived.by(() => getTierlist());
	let tier: TierType = $derived(tierlist.tiers[tier_id]);

	let items = $derived.by(() => {
		return tier.champions.map((champion, i) => {
			return {
				id: `id_${i}_of_champ_${champion}_in_tier_${tier_id}`,
				champion: champion,
			};
		});
	});

	function handleDndConsider(e: any) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: any) {
		items = e.detail.items;

		const { trigger, id } = e.detail.info;
		if (trigger == TRIGGERS.DROPPED_OUTSIDE_OF_ANY) {
			items.splice(
				items.findIndex((item_id) => id === item_id),
				1,
			);
		}

		updateChampions(items);
	}

	function updateChampions(items: any) {
		const tier_champions = [];
		for (const item of items) {
			tier_champions.push(item.champion);
		}

		tierlist.tiers[tier_id].champions = tier_champions;
		setTierlist(tierlist);
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
			<div>
				<ChampionIcon
					champion={item.champion}
					source="tier"
					{tier_id}
				/>
			</div>
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

		min-height: var(--championIconWidth);

		background: #0a0440;
		flex: 1;
	}
</style>
