<script lang="ts">
	const { text = "text", onclick, style = "" } = $props();
</script>

<button {style} class="text-button" {onclick}>{text}</button>

<style>
	.text-button {
		height: 40px;

		border-radius: 8px;
		border: 1px solid #707070;
		padding: 0.6em 1.2em;

		font-size: 1em;
		font-weight: 500;
		font-family: inherit;

		background-color: #06145e;

		cursor: pointer;
	}
</style>
