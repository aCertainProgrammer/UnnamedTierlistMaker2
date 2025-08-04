<script lang="ts">
	const { src, alt = `${src}`, onclick, classList = "" } = $props();
</script>

<button class="image-button" {onclick}>
	<img {alt} {src} class={classList} />
</button>

<style>
	.image-button {
		height: 40px;
		max-width: 40px;

		cursor: pointer;
		background: none;
		border: none;
	}
</style>
