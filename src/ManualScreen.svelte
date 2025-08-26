<script lang="ts">
	import { program_state } from "./state.svelte";
</script>

<div class="manual-screen">
	<div class="manual-top-buttons">
		<button
			class="text-button"
			onclick={() => {
				program_state.current_screen = "main_screen";
			}}>Close manual</button
		>
		<button
			class="text-button"
			onclick={() => {
				const manual_body = document.getElementById("manual-container");
				if (manual_body == null) {
					throw "manual-container null when it shouldn't be";
				}

				manual_body.scrollTop = 0;
			}}>Scroll to top</button
		>
	</div>
	<div id="manual-container">
		<zero-md src="./MANUAL.md"></zero-md>
	</div>
</div>

<style>
	.manual-screen {
		height: 100%;
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: start;
	}
	.manual-top-buttons {
		width: 100%;
		display: flex;
		gap: 4px;
	}

	#manual-container {
		height: 100%;
		width: max(50%, 900px);
		overflow-y: auto;
		padding: 20px 10px;
	}

	zero-md {
		text-align: start;
	}
</style>
