<script lang="ts">
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import { dndzone, TRIGGERS } from "svelte-dnd-action";
	import {
		getTierlist,
		setTierlist,
		type TierlistType,
		type TierType,
		all_colors,
		removeTier,
	} from "./tierlist.svelte";
	import { program_state } from "./state.svelte";

	type Props = {
		tier_id: number;
	};

	const { tier_id }: Props = $props();
	$inspect(tier_id);
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
				items.findIndex((item) => id === item.id),
				1,
			);
		} else if (trigger == TRIGGERS.DROPPED_INTO_ZONE) {
			let champion_to_validate = "";
			for (const item of items) {
				if (item.id == id) {
					champion_to_validate = item.champion;
				}
			}

			if (champion_to_validate !== "") {
				items = items.filter(
					(item) =>
						!(
							item.champion === champion_to_validate &&
							item.id != id
						),
				);
			}
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

	function showTierEditor() {
		program_state.currently_edited_tier_id = tier_id;
		program_state.tier_editor_open = true;
	}

	function closeTierEditor() {
		program_state.tier_editor_open = false;
	}
</script>

<div class="tier">
	<button
		class="tier-name"
		style="background: {tier.color};"
		onclick={showTierEditor}
	>
		<span>{tier.name}</span>
	</button>
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

	{#if program_state.tier_editor_open && program_state.currently_edited_tier_id == tier_id}
		<div class="tier-editor" onclick={closeTierEditor} role="none">
			<button
				class="text-button"
				onclick={(event: any) => {
					event?.stopPropagation();
					closeTierEditor();
				}}>Close</button
			>
			<div class="color-container">
				{#each all_colors as color}
					<input
						type="button"
						class="color-picker-button"
						style="background-color: {color};"
						onclick={(event: any) => {
							event?.stopPropagation();
							tierlist.tiers[tier_id].color = color;
							setTierlist(tierlist);
						}}
					/>
				{/each}
			</div>
			<input
				class="tier-name-input"
				type="text"
				placeholder="Tier name"
				bind:value={tier.name}
				onclick={(event: any) => {
					event?.stopPropagation();
				}}
			/>
			<button
				class="text-button"
				onclick={() => {
					removeTier(tier_id);
				}}>Delete</button
			>
		</div>
	{/if}
</div>

<style>
	.tier {
		min-height: var(--championIconWidth);
		width: 100%;

		display: flex;
		border: 1px solid black;
	}

	.tier-name {
		min-width: var(--championIconWidth);
		width: var(--championIconWidth);

		display: flex;
		justify-content: center;
		align-items: center;

		border: none;
		border-left: 1px solid black;
		cursor: pointer;
	}

	.tier-name > span {
		color: black;
		font-size: 1.2rem;
		text-align: center;
		word-break: break-all;
	}

	.tier-champions {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding-left: 4px;

		min-height: var(--championIconWidth);
		width: 100%;

		background: #0a0440;
		flex: 1;

		padding-right: 25px;
	}

	.tier-editor {
		position: fixed;
		top: 0px;
		left: 0px;
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 1;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.color-picker-button {
		border: 1px solid black;
		border-radius: 4px;
		height: 40px;
		width: 40px;
	}
</style>
