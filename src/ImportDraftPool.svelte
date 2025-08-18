<script lang="ts">
	import { importDraftPool, importPoolFromOpgg } from "./tierlist.svelte";

	import { program_state } from "./state.svelte";
	import HoverTextPopup from "./lib/HoverTextPopup.svelte";

	let ally_error = $state("");
	let enemy_error = $state("");
	let opgg_error = $state("");

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

	function getOpggString(): string {
		switch (opgg_error) {
			case "":
				return "Import from op.gg - DO NOT USE THIS IF YOU DON'T KNOW HOW TO";
			case "success":
				return "Success!";
			default:
				return opgg_error;
		}
	}

	function wrapImportPoolFromOPGG() {
		const text = prompt(
			"Paste the multi selection [NOT THE LINK IT WILL NOT WORK]",
		);
		if (!text) {
			return;
		}

		importPoolFromOpgg(text);
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
				opgg_error = "";
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
				opgg_error = "";
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
		<button
			class="text-button {getErrorState(opgg_error)}"
			onclick={() => {
				ally_error = "";
				enemy_error = "";
				try {
					wrapImportPoolFromOPGG();
					opgg_error = "success";
				} catch (e) {
					opgg_error = e as string;
				}
			}}>{getOpggString()}</button
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
