<script lang="ts">
	import { SaverLoader, type Snapshots } from "./saverloader.svelte";
	import { program_state } from "./state.svelte";
	import { getFilteredSnapshots } from "./filtering.svelte";
	import TierlistPreview from "./TierlistPreview.svelte";
	import {
		clearAllSnapshots,
		exportSnapshots,
		importSnapshots,
		loadSnapshot,
		screenshotAllSnapshots,
	} from "./tierlist.svelte";

	let current_page = $state(1);
	let items_per_page = $state(SaverLoader.getItemsPerPage());

	let search_query = $state("");
	let snapshots = $derived.by(() => {
		const snapshots = SaverLoader.getSnapshots();
		const filtered_snapshots = getFilteredSnapshots(
			search_query,
			snapshots,
		);

		if (filtered_snapshots.length < items_per_page) {
			return filtered_snapshots;
		} else {
			return filtered_snapshots.slice(
				(current_page - 1) * items_per_page,
				current_page * items_per_page,
			);
		}
	}) as Snapshots;

	function closeOverlay() {
		program_state.snapshot_overlay_open = false;
	}

	function stopPropagation(event: any) {
		event.stopPropagation();
	}

	function setPage(x: number) {
		const snapshots = SaverLoader.getSnapshots();
		const filtered_snapshots = getFilteredSnapshots(
			search_query,
			snapshots,
		);

		current_page = x;

		if (x <= 0) {
			current_page = 1;
		}
		const pages = Math.ceil(filtered_snapshots.length / items_per_page);

		if (x > pages) {
			current_page = pages;
		}
	}

	function changePage(x: number) {
		setPage(current_page + x);
	}

	function saveItemsPerPage() {
		SaverLoader.saveItemsPerPage(items_per_page);
	}
</script>

<div class="snapshots-overlay" role="none" onclick={closeOverlay}>
	<div class="panel snapshots-panel" onclick={stopPropagation} role="none">
		<div class="snapshots-top-bar">
			<div class="snapshots-top-bar-center">
				<button class="text-button" onclick={screenshotAllSnapshots}
					>Screenshot all</button
				>
				<button
					class="text-button"
					onclick={() => {
						const ok = confirm(
							"Do you want to clear all snapshots?",
						);
						if (ok) {
							clearAllSnapshots();
							current_page = 1;
							snapshots = [];
						}
					}}>Clear all</button
				>
				<input
					id="snapshots-search-bar"
					type="text"
					onclick={stopPropagation}
					bind:value={search_query}
					placeholder="Filter snapshots"
					oninput={() => {
						setPage(1);
					}}
				/>
				<button class="text-button" onclick={exportSnapshots}
					>Export snapshots</button
				>
				<button
					class="text-button"
					onclick={() => {
						const file_input = document.getElementById(
							"import-snapshots-file-input",
						);

						if (file_input == null) {
							console.error(
								"Import snapshots input null when it shouldn't be",
							);
							return;
						}

						file_input.click();
					}}
					>Import snapshots
				</button>
				<input
					id="import-snapshots-file-input"
					type="file"
					class="hidden"
					oninput={async (event: any) => {
						if (event.target == null) {
							console.error(
								"Import snapshots input null when it shouldn't be",
							);
							return;
						}

						if (event.target.files == null) {
							console.error(
								"event.target.files null when it shouldn't be",
							);
							return;
						}

						const files = event.target.files;
						const imported_snapshots = await importSnapshots(
							files[0],
						);

						if (imported_snapshots != null) {
							snapshots = imported_snapshots;
						}
					}}
				/>
			</div>
			<button class="text-button" onclick={closeOverlay}>Close</button>
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
		<div class="snapshots-bot-bar">
			<div style="height:100%">
				<label for="page-items-select">Items per page</label>
				<select
					id="page-items-select"
					class="page-items-select"
					bind:value={items_per_page}
					onchange={saveItemsPerPage}
				>
					<option selected={items_per_page == 20}>20</option>
					<option selected={items_per_page == 50}>50</option>
					<option selected={items_per_page == 100}>100</option>
				</select>
			</div>
			<button
				class="text-button"
				onclick={() => {
					changePage(-1);
				}}>&lt;</button
			>
			<input
				type="text"
				onclick={stopPropagation}
				bind:value={current_page}
				placeholder="Page"
				class="page-counter"
			/>
			<button
				class="text-button"
				onclick={() => {
					changePage(1);
				}}>&gt;</button
			>
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
		z-index: 1;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.snapshots-panel {
		height: 90%;
		width: 90%;

		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;

		gap: 10px;

		overflow: hidden;
	}

	.snapshots-top-bar,
	.snapshots-bot-bar {
		width: 100%;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		background: none;

		gap: 4px;
	}

	#snapshots-search-bar {
		height: 100%;
		font-size: 1rem;
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
	}

	.page-counter {
		width: 50px;
		height: 100%;
		font-size: 1rem;
	}

	.snapshots-top-bar-center {
		width: 100%;

		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: center;

		gap: 4px;
	}
</style>
