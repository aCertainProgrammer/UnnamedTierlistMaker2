<script lang="ts">
	import { capitalize, prettifyChampionName } from "../util";
	import HoverTextPopup from "./HoverTextPopup.svelte";
	const { champion } = $props();
	const hoverText = $derived.by(() => prettifyChampionName(champion));
	let should_show_hover = $state(false);

	function onmouseover(): void {
		should_show_hover = true;
	}
	function onmouseout(): void {
		should_show_hover = false;
	}
</script>

<div class="relative">
	{#if should_show_hover}
		<HoverTextPopup text={hoverText} />
	{/if}
	<img
		class="champion-icon"
		src="./img/champion_icons/{capitalize(champion)}.webp"
		alt="{champion} champion icon"
		{onmouseover}
		{onmouseout}
		onfocus={onmouseover}
		onblur={onmouseout}
		data-champion={champion}
	/>
</div>

<style>
	.champion-icon {
		cursor: pointer;
		width: var(--championIconWidth);
	}

	.relative {
		position: relative;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
