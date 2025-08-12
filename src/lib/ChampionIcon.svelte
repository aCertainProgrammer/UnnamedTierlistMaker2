<script lang="ts">
	import { SaverLoader } from "../saverloader.svelte";
	import type { ChampionDragDataType } from "../tierlist.svelte";
	import { capitalize, prettifyChampionName } from "../util";
	import HoverTextPopup from "./HoverTextPopup.svelte";

	let settings = SaverLoader.getSettings();

	const {
		champion,
		source,
		tier_id = undefined,
		custom_ondragstart = undefined,
	} = $props();
	let src = $derived(`./img/champion_icons/${capitalize(champion)}.webp`);

	const hoverText = $derived.by(() => prettifyChampionName(champion));
	let should_show_hover = $state(false);

	function onmouseover(): void {
		should_show_hover = true;
	}
	function onmouseout(): void {
		should_show_hover = false;
	}

	function ondragstart(event: any): void {
		const drag_data: ChampionDragDataType = {
			champion: champion,
			source: source,
			tier_id: tier_id,
		};
		if (custom_ondragstart != undefined) {
			custom_ondragstart(drag_data);
		}

		event.dataTransfer?.clearData();
		event.dataTransfer?.setData("text/plain", JSON.stringify(drag_data));

		const image = document.createElement("img");
		image.src = src;
		image.id = "drag-image";
		image.style.display = "none";
		image.classList = "champion-icon";
		document.body.appendChild(image);

		const width = event.target?.offsetWidth;
		const height = event.target?.offsetHeight;

		event.dataTransfer?.setDragImage(image, width / 2, height / 2);
	}

	function ondragend() {
		const drag_image = document.getElementById("drag-image");
		if (drag_image == null) {
			console.error("null drag_image");
			return;
		}

		document.body.removeChild(drag_image);
	}
</script>

<div class="relative">
	{#if should_show_hover && settings.showChampionNamesOnHover}
		<HoverTextPopup text={hoverText} />
	{/if}
	<img
		class="champion-icon"
		{src}
		alt="{champion} champion icon"
		{onmouseover}
		{onmouseout}
		onfocus={onmouseover}
		onblur={onmouseout}
		data-champion={champion}
		draggable="true"
		{ondragstart}
		{ondragend}
	/>
</div>

<style>
	.champion-icon {
		cursor: grab;
		width: var(--championIconWidth);
		padding: 2px;
	}

	.relative {
		position: relative;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	:global(#dnd-action-dragged-el .champion-icon) {
		opacity: 0.5;
	}
</style>
