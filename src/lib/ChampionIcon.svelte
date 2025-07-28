<script lang="ts">
	import { capitalize } from "../util";
	const { champion } = $props();
</script>

<img
	class="champion-icon"
	src="./img/champion_icons/{capitalize(champion)}.webp"
	alt="{champion} champion icon"
/>
