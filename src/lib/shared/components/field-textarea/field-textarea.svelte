<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldTextareaProps {
		disabled?: boolean;
		id: string;
		label?: string;
		value: string;
	}

	let { disabled = false, id = '', label = '', value = $bindable('') }: FieldTextareaProps = $props();
</script>

<div class="field-input">
	{#if label}
		<label for={id} class="field-input__label">{label}</label>
	{/if}
	<div class="field-input__wrapper">
		<textarea {disabled} {id} name={id} bind:value></textarea>
	</div>
</div>
