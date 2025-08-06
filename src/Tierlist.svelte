<script lang="ts">
	import Tier from "./Tier.svelte";
	import TextButton from "./lib/TextButton.svelte";
	import TextInput from "./lib/TextInput.svelte";
	import {
		getNewTierName,
		getTierlist,
		setTierlist,
	} from "./tierlist.svelte";
	import type { TierlistType, TierType } from "./tierlist.svelte";
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

	function addTier() {
		const tierlist = getTierlist();
		const new_tier: TierType = {
			id: tierlist.tiers.length,
			name: getNewTierName(tierlist),
			champions: [],
			color: "tomato",
		};

		tierlist.tiers.push(new_tier);
	}
</script>

<div class="tierlist">
	<TextInput
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
			<div>
				<Tier tier_id={item.tier.id} />
				<div use:dragHandle class="drag-handle">
					<img src="./img/drag_handle.webp" alt="drag-handle" />
				</div>
			</div>
		{/each}
		<TextButton
			style="width:100%; height:80px"
			text="+"
			onclick={addTier}
		/>
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

		padding-top: 20px;
		padding-bottom: 10px;
	}

	.tiers-container {
		overflow-y: auto;
	}

	.tiers-container,
	.tiers-container > div {
		width: 100%;
	}

	.tiers-container > div {
		position: relative;
	}

	.drag-handle {
		height: 15px;
		position: absolute;
		top: calc(50% - 7.5px);
		right: 10px;
		opacity: 0.7;
	}
</style>
