<script lang="ts">

type ProgramState = "main_screen" | "settings"
const program_state:ProgramState = "main_screen"
</script>

<main>
    {#if program_state == "main_screen"}
        <MainScreen />
        {:else if program_state == "settings"}
        <SettingsScreen />
    {/if}
</main>

<style></style>
