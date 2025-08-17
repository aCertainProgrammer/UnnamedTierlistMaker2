<script lang="ts">
	import Tier from "./Tier.svelte";
	import { getTierlist, setTierlist, addTier } from "./tierlist.svelte";
	import type { TierlistType } from "./tierlist.svelte";
	import { dragHandleZone, dragHandle } from "svelte-dnd-action";
	let tierlist: TierlistType = $derived.by(() => getTierlist());

	let items = $derived.by(() =>
		tierlist.tiers.map((tier, index) => {
			return {
				id: index,
				tier: tier,
			};
		}),
	);

	function changeTierlistName(event: any) {
		if (event.target == null) {
			console.error("Tierlist name input is null");
			return;
		}

		tierlist.name = event.target.value.trim();
		setTierlist(tierlist);
	}

	function handleDndConsider(e: any) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: any) {
		items = e.detail.items;

		const tierlist = getTierlist();
		items.forEach((item, index) => {
			item.tier.id = index;
			tierlist.tiers[index] = item.tier;
		});

		setTierlist(tierlist);
	}
</script>

<div class="tierlist">
	<input
		type="text"
		class="text-input"
		oninput={changeTierlistName}
		value={tierlist.name}
		placeholder="Tierlist name"
		style="width:100%"
		id="tierlist-name-input"
	/>
	<div
		class="tiers-container"
		use:dragHandleZone={{
			items,
			type: "tierlist",
			dropTargetStyle: {},
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<div class="tier-wrapper">
				<Tier tier_id={item.tier.id} />
				<div use:dragHandle class="drag-handle">
					<img src="./img/drag_handle.webp" alt="drag-handle" />
				</div>
			</div>
		{/each}
		<button class="new-tier-button" onclick={addTier}>
			<span>+</span>
			<span>Add new tier</span>
		</button>
	</div>
</div>

<style>
	.tierlist {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;

		flex: 1 0 auto;

		width: 50%;
		height: 100%;

		gap: 4px;

		padding-top: 20px;
		padding-bottom: 10px;
	}

	.tiers-container {
		overflow-y: auto;

		padding-top: 15px;
		padding-left: 5px;
		padding-right: 5px;
	}

	.tiers-container,
	.tiers-container > div {
		width: 100%;
	}

	.tiers-container > div {
		position: relative;
	}

	.drag-handle {
		position: relative;
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		padding: 4px;

		background: var(--tierBackground);
		border: 2px solid var(--tierBorderColor);
		border-left: none;
	}

	.drag-handle > img {
		opacity: var(--dragHandleOpacity);
	}

	.new-tier-button {
		width: 100%;
		height: var(--championIconWidth);

		border-radius: var(--generalBorderRadius);
		border: 1px solid var(--generalBorderColor);
		padding: 0.6em 1.2em;

		font-size: 1.5em;
		font-weight: 500;
		font-family: inherit;

		background: var(--addTierBackground);

		cursor: pointer;

		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;

		margin-top: 1px;
	}

	.tier-wrapper {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
