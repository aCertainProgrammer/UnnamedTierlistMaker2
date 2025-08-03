<script lang="ts">
	import Tier from "./Tier.svelte";
	import TextInput from "./lib/TextInput.svelte";
	import { getTierlist, setTierlist } from "./tierlist.svelte";
	import type { TierlistType } from "./tierlist.svelte";
	import { dndzone, dragHandleZone, dragHandle } from "svelte-dnd-action";

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
	<TextInput
		oninput={changeTierlistName}
		value={tierlist.name}
		placeholder="Tierlist name"
		style="width:100%"
		id="tierlist-name-input"
	/>
	<div
		class="tiers-container"
		use:dragHandleZone={{ items, type: "tierlist", dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<div>
				<Tier tier_id={item.tier.id} />
				<div use:dragHandle class="drag-handle">
					<img
						src="./public/img/drag_handle.webp"
						alt="drag-handle"
					/>
				</div>
			</div>
		{/each}
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

	.tiers-container,
	.tiers-container > div {
		width: 100%;
	}

	.tiers-container > div {
		position: relative;
	}

	.drag-handle {
		position: absolute;
		top: 30px;
		right: 10px;
		height: 100%;
		opacity: 0.7;
	}
</style>
