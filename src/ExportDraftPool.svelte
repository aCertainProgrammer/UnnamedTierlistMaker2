<script lang="ts">
	import TextButton from "./lib/TextButton.svelte";
	import {
		exportDraftPool,
		getTierlist,
		type TierlistType,
	} from "./tierlist.svelte";

	import { program_state } from "./state.svelte";
	import TextInput from "./lib/TextInput.svelte";

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
	<TextButton text="Cancel" onclick={() => {}} />
	<TextButton
		text="Download pool"
		onclick={() => {
			exportDraftPool(tierlist, null);
		}}
	/>
	<TextButton
		text="Set ally pool in Unnamed Drafting Tool"
		onclick={() => {
			exportDraftPool(tierlist, "ally");
		}}
	/>
	<TextButton
		text="Set enemy pool in Unnamed Drafting Tool"
		onclick={() => {
			exportDraftPool(tierlist, "enemy");
		}}
	/>
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
