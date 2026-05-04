<script lang="ts">
	import { z } from 'zod';
	import FieldTextarea from '$lib/shared/components/field-textarea/field-textarea.svelte';
	import Icon from '$lib/shared/components/icon/icon.svelte';

	const formSchema = z.object({
		label: z.string(),
		value: z.number(),
	});
	const dataSchema = z.array(formSchema);

	const { ondismiss = () => {} }: { ondismiss?: (data?: object) => void } = $props();

	let error = $state('');
	let value = $state('');

	function parseValue() {
		if (!value) return;

		const data = `[${value}]`;
		const result = dataSchema.safeParse(JSON.parse(data));

		if (!result.success) {
			error = result.error.message;
			return;
		}

		if (result.data.length < 1) {
			error = 'Array is empty!';
			return;
		}

		ondismiss(result.data);
	}
</script>

<div class="e-modal e-modal--alert">
	<div class="e-modal__icon">
		<span><Icon name="brackets-curly" /></span>
	</div>

	<h4 class="e-modal__title">Load data from JSON</h4>

	<p>
		Insert in the textarea below the contents from a JSON array which each item has this structure: <code
			class="text-blue">{'{"label":"Name","value":0}'}</code
		>.<!-- A maximum of 10 items will be loaded.-->
	</p>

	<div>
		<FieldTextarea id="chart-json-modal" bind:value />
	</div>

	{#if error}
		<p class="text-error">{error}</p>
	{/if}

	<div class="e-modal__footer e-modal__footer-end">
		<button class="button button-default" onclick={() => ondismiss()}>Cancel</button>
		<button class="button button-primary" disabled={!value} onclick={() => parseValue()}>Load</button>
	</div>
</div>
