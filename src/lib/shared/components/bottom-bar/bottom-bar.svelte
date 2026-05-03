<script lang="ts">
	import './bottom-bar.scss';

	let { content = '' } = $props();
</script>

{#if content}
	<div class="bottom-bar">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<span>{@html content.replaceAll('\n', ' <var></var> ')}</span>
	</div>
{/if}
