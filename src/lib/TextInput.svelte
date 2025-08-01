<script lang="ts">
	const { oninput, value = "", placeholder = "", style = "" } = $props();
</script>

<input {oninput} type="text" class="text-input" {value} {placeholder} {style} />

<style>
	.text-input {
		height: 2em;

		border-radius: 8px;
		border: 1px solid #707070;
		padding: 0.2em 0.4em;

		font-size: 1em;
		font-weight: 500;
		font-family: inherit;
		text-align: center;

		background-color: #06145e;

		cursor: text;
	}
</style>
