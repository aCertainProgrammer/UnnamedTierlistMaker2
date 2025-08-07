<script lang="ts">
	const { src, alt = `${src}`, onclick, classList = "" } = $props();
</script>

<button class="image-button" {onclick}>
	<img {alt} {src} class={classList} />
</button>
