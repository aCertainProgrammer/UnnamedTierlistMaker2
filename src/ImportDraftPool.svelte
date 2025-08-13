<script lang="ts">
	import { importDraftPool } from "./tierlist.svelte";

	import { program_state } from "./state.svelte";

	let ally_error = $state("");
	let enemy_error = $state("");

	function getErrorState(string: string): string {
		switch (string) {
			case "":
				return "";
			case "success":
				return "success";
			default:
				return "error";
		}
	}

	function getAllyString(): string {
		switch (ally_error) {
			case "":
				return "Import ally pool from Unnamed Drafting Tool";
			case "success":
				return "Success!";
			default:
				return ally_error;
		}
	}

	function getEnemyString(): string {
		switch (enemy_error) {
			case "":
				return "Import enemy pool from Unnamed Drafting Tool";
			case "success":
				return "Success!";
			default:
				return enemy_error;
		}
	}
</script>

<div
	class="overlay"
	onclick={() => {
		program_state.import_pool_overlay_open = false;
	}}
	role="none"
>
	<div
		class="panel export-draft-pool-panel"
		role="none"
		onclick={(event: any) => {
			event.stopPropagation();
		}}
	>
		<button
			class="text-button"
			style="align-self:end"
			onclick={() => {
				program_state.import_pool_overlay_open = false;
			}}>Cancel</button
		>
		<button
			class="text-button {getErrorState(ally_error)}"
			onclick={() => {
				enemy_error = "";
				try {
					importDraftPool("ally");
					ally_error = "success";
				} catch (e) {
					ally_error = e as string;
				}
			}}
		>
			{getAllyString()}
		</button>
		<button
			class="text-button {getErrorState(enemy_error)}"
			onclick={() => {
				ally_error = "";
				try {
					importDraftPool("enemy");
					enemy_error = "success";
				} catch (e) {
					enemy_error = e as string;
				}
			}}
		>
			{getEnemyString()}</button
		>
	</div>
</div>

<style>
	.export-draft-pool-panel {
		min-width: 500px;
		min-height: 200px;
		padding: 20px 30px;
		display: flex;
		flex-flow: column wrap;
		align-items: start;
		justify-content: start;

		gap: 10px;
	}
</style>
