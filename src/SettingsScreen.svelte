<script lang="ts">
	import TextButton from "./lib/TextButton.svelte";
	import { state } from "./state.svelte";
</script>

<TextButton
	text="Close settings"
	onclick={() => {
		state.current_screen = "main_screen";
	}}
/>
