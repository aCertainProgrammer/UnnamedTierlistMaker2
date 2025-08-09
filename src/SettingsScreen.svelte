<script lang="ts">
	import { program_state } from "./state.svelte";
</script>

<button
	class="text-button"
	onclick={() => {
		program_state.current_screen = "main_screen";
	}}>Close settings</button
>
