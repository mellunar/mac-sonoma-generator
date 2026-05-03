<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldInputProps {
		class?: string;
		disabled?: boolean;
		id: string;
		label?: string;
		type?: 'text' | 'email' | 'password';
		value: string;
	}

	let {
		class: className,
		disabled = false,
		id = '',
		label = '',
		type = 'text',
		value = $bindable(''),
	}: FieldInputProps = $props();

	function clearValue() {
		value = '';
	}
</script>

<div class={'field-input ' + className}>
	{#if label}
		<label for={id} class="field-input__label">{label}</label>
	{/if}
	<div class="field-input__wrapper">
		<input class:field-input--has-clear={value} {disabled} {id} name={id} {type} bind:value />

		{#if value}
			<button class="field-input__clear" onclick={clearValue}>
				<img src="/mac/clear-button.svg" alt="" draggable="false" />
			</button>
		{/if}
	</div>
</div>
