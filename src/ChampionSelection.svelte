<script lang="ts">
	import { default_data } from "./default_data";
	import {
		dndzone,
		TRIGGERS,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
	} from "svelte-dnd-action";
	import { passesLegacyQuery } from "./filtering.svelte";
	import ChampionIcon from "./lib/ChampionIcon.svelte";
	import TextInput from "./lib/TextInput.svelte";

	let search_query = $state("");

	let items = $derived.by(() => {
		const arr: Array<{
			id: number;
			champion: string;
		}> = [];
		default_data.forEach((champion, i) => {
			if (!passesLegacyQuery(champion, search_query)) {
				return;
			}

			arr.push({
				id: i,
				champion: default_data[i],
			});
		});

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

	function setSearchQuery(event: any) {
		if (event.target == null) {
			console.error(
				"Champion selection search bar null when it shouldn't be",
			);
			return;
		}

		search_query = event.target.value;
	}
</script>

<div class="champion-selection">
	<TextInput
		oninput={setSearchQuery}
		value={search_query}
		placeholder="Search for champions"
		style="width:100%"
	/>
	<div
		class="champions"
		use:dndzone={{
			items,
			dropTargetStyle: {},
			dropFromOthersDisabled: true,
		}}
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
</div>

<style>
	.champion-selection {
		width: 50%;
		height: 100%;
		max-height: 100%;
		padding-top: 20px;
	}

	.champions {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: start;

		gap: 2px;

		overflow-y: auto;

		width: 100%;
		max-height: 100%;
		padding-top: 20px;
		padding-bottom: 30px;
	}
</style>
