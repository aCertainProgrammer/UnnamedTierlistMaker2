<script lang="ts">
	import {
		dndzone,
		TRIGGERS,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
	} from "svelte-dnd-action";
	import { all_champions, getFilteredChampions } from "./filtering.svelte";
	import ChampionIcon from "./lib/ChampionIcon.svelte";

	type Role = "top" | "jungle" | "mid" | "adc" | "support" | "none";

	let search_query = $state("");
	let role_query: Role = $state("none");

	let items = $derived.by(() => {
		const arr: Array<{
			id: number;
			champion: string;
			visible: boolean;
		}> = [];

		const filtered_champions = getFilteredChampions(
			search_query,
			role_query,
		);

		all_champions.forEach((champion, i) => {
			let visible = true;
			if (!filtered_champions.includes(champion)) {
				visible = false;
			}

			arr.push({
				id: i,
				champion: champion,
				visible: visible,
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

	function setRoleFilter(event: any, role: Role) {
		const role_icon_container = document.getElementById("role-icons");
		if (role_icon_container == null) {
			console.error("Role icon container null when it shouldn't be");
			return;
		}
		if (role_icon_container?.children.length == null) {
			console.error(
				"Role icon container children null when it shouldn't be",
			);
			return;
		}

		if (event.target == null) {
			console.error("Role icon null when it shouldn't be");
			return;
		}

		if (role_query === role) {
			role_query = "none";
		} else {
			role_query = role;
		}
	}

	const roles: Array<Role> = ["top", "jungle", "mid", "adc", "support"];
</script>

<div class="champion-selection">
	<div class="champion-selection-top-bar">
		<div id="role-icons">
			{#each roles as role}
				<button
					onclick={(event: any) => setRoleFilter(event, role)}
					class="image-button {role_query === role ? 'selected' : ''}"
				>
					<img
						src="./img/{role}_icon.webp"
						alt="{role} filter button"
					/>
				</button>
			{/each}
		</div>
		<input
			type="text"
			class="text-input"
			oninput={setSearchQuery}
			value={search_query}
			placeholder="Search for champions"
			style="width:50%"
			id="champion-selection-search-bar"
		/>
	</div>
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
			<div class={item.visible ? "" : "hidden"}>
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

		overflow-y: auto;

		width: 100%;
		max-height: 100%;
		padding-top: 20px;
		padding-bottom: 40px;
	}
	.champion-selection-top-bar {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: start;
	}
</style>
