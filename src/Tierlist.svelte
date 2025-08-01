<script lang="ts">
	import Tier from "./Tier.svelte";
	import TextInput from "./lib/TextInput.svelte";
	import { getTierlist, setTierlist } from "./tierlist.svelte";
	import type { TierlistType } from "./tierlist.svelte";

	let tierlist: TierlistType = $derived.by(() => getTierlist());
	function changeTierlistName(event: any) {
		if (event.target == null) {
			console.error("Tierlist name input is null");
			return;
		}

		tierlist.name = event.target.value.trim();
		setTierlist(tierlist);
	}
</script>

<div class="tierlist">
	<TextInput
		oninput={changeTierlistName}
		value={tierlist.name}
		placeholder="Tierlist name"
		style="width:100%"
	/>
	{#each tierlist.tiers as _, key}
		{#key key}
			<Tier tier_id={key} />
		{/key}
	{/each}
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
</style>
