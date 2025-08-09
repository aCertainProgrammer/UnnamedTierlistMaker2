<script lang="ts">
	import { capitalize } from "./util";
	import {
		changeSnapshotName,
		getSnapshotById,
		removeSnapshot,
	} from "./tierlist.svelte";
	import type { Snapshot } from "./saverloader.svelte";
	import { exportTierlistAsImage } from "./images.svelte";

	const {
		snapshot,
		onclick = function () {},
	}: {
		snapshot: Snapshot;
		onclick?: any;
	} = $props();

	function changeSnapshotTierlistName(event: any) {
		if (event.target == null) {
			console.error("Snapshot name input null when it shouldn't be");
			return;
		}

		changeSnapshotName(event.target.value, snapshot.id);
	}

	let hidden = $state(false);
</script>

<button class="tierlist-preview" {onclick} style={hidden ? "display:none" : ""}>
	<div
		class="image-button snapshot-remove-button"
		onclick={(event: any) => {
			event.stopPropagation();
			hidden = true;
			removeSnapshot(snapshot.id);
		}}
	>
		<img src="./img/trash-icon.webp" alt="trash icon" />
	</div>
	<div
		class="image-button snapshot-screenshot-button"
		onclick={(event: any) => {
			event.stopPropagation();
			exportTierlistAsImage(getSnapshotById(snapshot.id).tierlist);
		}}
	>
		<img src="./img/screenshot.webp" alt="trash icon" />
	</div>
	<input
		type="text"
		class="tierlist-name-preview"
		value={snapshot.tierlist.name}
		oninput={changeSnapshotTierlistName}
		onclick={(event) => {
			event.stopPropagation();
		}}
	/>
	<div class="preview-tiers-container">
		{#each snapshot.tierlist.tiers as tier (tier.id)}
			<div class="tier-preview">
				<div
					class="preview-tier-name"
					style="background: {tier.color};"
				>
					<span>{tier.name}</span>
				</div>
				<div class="preview-tier-champions">
					{#each tier.champions as champion, index (index)}
						<div>
							<img
								class="preview-champion-icon"
								src="./img/champion_icons/{capitalize(
									champion,
								)}.webp"
								alt="{champion} champion icon"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</button>

<style>
	.tierlist-preview {
		position: relative;
		max-height: var(--snapshotContainerHeight);
		max-width: var(--snapshotContainerHeight);
		height: var(--snapshotContainerHeight);
		width: var(--snapshotContainerHeight);
		min-height: var(--snapshotContainerHeight);
		min-width: var(--snapshotContainerHeight);

		overflow-y: auto;

		border: 1px solid #aaaaaa;
		border-radius: var(--generalBorderRadius);
		padding: 4px 4px;

		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: center;
		justify-content: space-evenly;

		background: none;
	}

	.tierlist-name-preview {
		width: 100%;
		min-height: 20px;
		max-height: 20px;
		font-size: 15px;
		background: #06145e;
		margin-top: 30px;
	}

	.snapshot-remove-button {
		position: absolute;
		top: 5px;
		right: 10px;
	}

	.snapshot-screenshot-button {
		position: absolute;
		top: 5px;
		left: 10px;
		max-width: 25px;
	}

	.preview-tiers-container {
		height: calc(100% - 2rem - 8px);
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.tier-preview {
		min-height: var(--previewChampionIconWidth);
		width: 100%;
		display: flex;

		border: 1px solid black;
		background: #0a0440;
	}

	.preview-tier-name {
		min-width: calc(1.5 * var(--previewChampionIconWidth));
		width: calc(1.5 * var(--previewChampionIconWidth));

		display: flex;
		justify-content: center;
		align-items: center;

		border: none;
		border-left: 1px solid black;
	}
	.preview-tier-name > span {
		color: black;

		text-align: center;
		word-break: break-all;
	}

	.preview-tier-champions {
		width: 100%;
		min-height: var(--previewChampionIconWidth);

		display: flex;
		flex-flow: row wrap;
		flex: 1;

		gap: 2px;
		padding-left: 4px;
	}
	.preview-champion-icon {
		max-width: var(--previewChampionIconWidth);
	}
</style>
