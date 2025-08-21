<script lang="ts">
	import { setContext } from "svelte";
	import MainScreen from "./MainScreen.svelte";
	import SettingsScreen from "./SettingsScreen.svelte";
	import { program_state } from "./state.svelte";
	import { SaverLoader } from "./saverloader.svelte";
	import ManualScreen from "./ManualScreen.svelte";

	setContext("role-filter", "none");

	document.documentElement.dataset.theme = SaverLoader.getTheme();
</script>

<main>
	{#if program_state.current_screen == "main_screen"}
		<MainScreen />
	{:else if program_state.current_screen == "settings_screen"}
		<SettingsScreen />
	{:else if program_state.current_screen == "manual_screen"}<ManualScreen />
	{/if}
</main>

<style>
	main {
		height: 100%;
		width: 100%;
		max-height: 100%;
		max-width: 100%;
	}
</style>
