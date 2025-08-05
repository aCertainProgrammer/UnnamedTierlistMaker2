<script lang="ts">
	import TextButton from "./lib/TextButton.svelte";
	import { program_state } from "./state.svelte";
</script>

<TextButton
	text="Close settings"
	onclick={() => {
		program_state.current_screen = "main_screen";
	}}
/>
