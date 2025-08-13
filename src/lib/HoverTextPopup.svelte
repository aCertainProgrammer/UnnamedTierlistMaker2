<script lang="ts">
	const { text } = $props();
</script>

<div class="hover-text-popup">{text}</div>

<style>
	.hover-text-popup {
		position: absolute;
		top: -20px;

		background: var(--hoverTextBackground);
		border-radius: 4px;
		padding: 1px 2px;
	}
</style>
