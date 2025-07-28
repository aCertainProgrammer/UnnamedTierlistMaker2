<script lang="ts">
	import MainScreen from "./MainScreen.svelte";
	import SettingsScreen from "./SettingsScreen.svelte";
	import { state } from "./state.svelte";
</script>

<main>
	{#if state.current_screen == "main_screen"}
		<MainScreen />
	{:else if state.current_screen == "settings_screen"}
		<SettingsScreen />
	{/if}
</main>

<style></style>
