<script lang="ts">
	import { exportDraftPool, getTierlist } from "./tierlist.svelte";
	import { type TierlistType } from "./tierlist.svelte";
	import { program_state } from "./state.svelte";

	let tierlist: TierlistType = $derived.by(() => {
		return getTierlist();
	});

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
				return "Export ally pool to Unnamed Drafting Tool";
			case "success":
				return "Success!";
			default:
				return ally_error;
		}
	}

	function getEnemyString(): string {
		switch (enemy_error) {
			case "":
				return "Export enemy pool to Unnamed Drafting Tool";
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
		program_state.export_pool_overlay_open = false;
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
				program_state.export_pool_overlay_open = false;
			}}>Cancel</button
		>
		<button
			class="text-button"
			onclick={() => {
				exportDraftPool(tierlist, null);
			}}>Download pool</button
		>
		<button
			class="text-button {getErrorState(ally_error)}"
			onclick={() => {
				enemy_error = "";
				try {
					exportDraftPool(tierlist, "ally");
					ally_error = "success";
				} catch (e) {
					ally_error = e as string;
				}
			}}>{getAllyString()}</button
		>
		<button
			class="text-button {getErrorState(enemy_error)}"
			onclick={() => {
				ally_error = "";
				try {
					exportDraftPool(tierlist, "enemy");
					enemy_error = "success";
				} catch (e) {
					enemy_error = e as string;
				}
			}}>{getEnemyString()}</button
		>
	</div>
</div>

<style>
	.export-draft-pool-panel {
		padding: 20px 30px;
		display: flex;
		flex-flow: column wrap;
		align-items: start;
		justify-content: start;

		gap: 10px;
	}
</style>
