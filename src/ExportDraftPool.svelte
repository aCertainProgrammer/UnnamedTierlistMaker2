<script lang="ts">
	import {
		exportDraftPool,
		getTierlist,
		type TierlistType,
	} from "./tierlist.svelte";

	import { program_state } from "./state.svelte";

	let tierlist: TierlistType = $derived.by(() => {
		return getTierlist();
	});
</script>

<div
	class="export-draft-pool-overlay"
	onclick={() => {
		program_state.export_pool_overlay_open = false;
	}}
	role="none"
>
	<button class="text-button">Cancel</button>
	<button
		class="text-button"
		onclick={() => {
			exportDraftPool(tierlist, null);
		}}>Download pool</button
	>
	<button
		class="text-button"
		onclick={() => {
			exportDraftPool(tierlist, "ally");
		}}>Set ally pool in Unnamed Drafting Tool</button
	>
	<button
		class="text-button"
		onclick={() => {
			exportDraftPool(tierlist, "enemy");
		}}
	>
		Set enemy pool in Unnamed Drafting Tool</button
	>
</div>

<style>
	.export-draft-pool-overlay {
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
</style>
