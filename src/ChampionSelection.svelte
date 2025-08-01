<script lang="ts">
	import { default_data } from "./default_data";
	import {
		dndzone,
		TRIGGERS,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
	} from "svelte-dnd-action";
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import Tierlist from "./Tierlist.svelte";

	let items = $derived.by(() => {
		const arr = [];
		for (let i = 0; i < default_data.length; i++) {
			arr.push({
				id: i,
				champion: default_data[i],
			});
		}

		return arr;
	});

	let shouldIgnoreDndEvents = false;

	function handleDndConsider(e: any) {
		const { trigger, id } = e.detail.info;
		if (trigger == TRIGGERS.DRAG_STARTED) {
			const index = items.findIndex((item) => item.id === id);
			const new_id = `${id}_copy_${Math.round(Math.random() * 100000)}`;
			e.detail.items = e.detail.items.filter(
				(item: any) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME],
			);
			e.detail.items.splice(index, 0, { ...items[index], id: new_id });
			items = e.detail.items;
			shouldIgnoreDndEvents = true;
		} else if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
		}
	}

	function handleDndFinalize(e: any) {
		if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
			shouldIgnoreDndEvents = false;
		}
	}
</script>

<div
	class="champions"
	use:dndzone={{ items, dropTargetStyle: {}, dropFromOthersDisabled: true }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div>
			<ChampionIcon
				champion={item.champion}
				source="champion_selection"
			/>
		</div>
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
