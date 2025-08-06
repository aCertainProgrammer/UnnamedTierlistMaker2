<script lang="ts">
	import { SaverLoader, type Snapshots } from "./saverloader.svelte";
	import { program_state } from "./state.svelte";
	import { getFilteredSnapshots } from "./filtering.svelte";
	import TierlistPreview from "./TierlistPreview.svelte";
	import { loadSnapshot } from "./tierlist.svelte";
	import TextButton from "./lib/TextButton.svelte";

	let search_query = $state("");
	let snapshots = $derived.by(() => {
		const snapshots = SaverLoader.getSnapshots();
		const filtered_snapshots = getFilteredSnapshots(
			search_query,
			snapshots,
		);

		return filtered_snapshots;
	}) as Snapshots;

	function closeOverlay() {
		program_state.snapshot_overlay_open = false;
	}
	function stopPropagation(event: any) {
		event.stopPropagation();
	}
</script>

<div class="snapshots-overlay" role="none" onclick={closeOverlay}>
	<div class="snapshots-panel" onclick={stopPropagation} role="none">
		<div class="snapshots-top-bar">
			<input
				type="text"
				onclick={stopPropagation}
				bind:value={search_query}
				placeholder="Filter snapshots"
			/>
			<TextButton text="Close" onclick={closeOverlay} />
		</div>
		<div class="snapshots-container">
			{#each snapshots as snapshot}
				<TierlistPreview
					{snapshot}
					onclick={() => {
						loadSnapshot(snapshot.id);
					}}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.snapshots-overlay {
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

	.snapshots-panel {
		height: 80%;
		width: 80%;

		background: rgba(0, 0, 0, 0.5);

		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;

		overflow: hidden;
	}

	.snapshots-top-bar {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.snapshots-container {
		width: 100%;
		height: 100%;

		display: flex;
		flex-flow: row wrap;
		row-gap: 10px;
		column-gap: 10px;

		align-items: start;
		justify-content: center;

		overflow-y: auto;
		background: rgba(30, 30, 30, 0.4);
	}
</style>
