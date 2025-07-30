<script lang="ts">
	import Tier from "./Tier.svelte";
	import { getTierlist } from "./tierlist.svelte";
	import type { TierlistType } from "./tierlist.svelte";

	let tierlist: TierlistType = $derived.by(() => getTierlist());
	$inspect(tierlist);
</script>

<div class="tierlist">
	{#each tierlist.tiers as tier, key}
		{#key key}
			<Tier {tier} />
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
