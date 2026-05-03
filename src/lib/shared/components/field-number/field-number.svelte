<script lang="ts">
	import '$lib/styles/field.scss';
	import Icon from '../icon/icon.svelte';

	interface FieldInputProps {
		class?: string;
		disabled?: boolean;
		hasStepper?: boolean;
		id: string;
		label?: string;
		min?: number;
		max?: number;
		value: number;
	}

	let {
		class: className = '',
		disabled = false,
		hasStepper = true,
		id = '',
		label = '',
		min,
		max,
		value = $bindable(0),
	}: FieldInputProps = $props();

	let inputHeight: number = $state(0);

	function increment() {
		if (typeof max === 'number' && value >= max) return;

		value += 1;
	}

	function decrement() {
		if (typeof min === 'number' && value <= min) return;

		value -= 1;
	}
</script>

<div class={'field-input ' + className}>
	{#if label}
		<label for={id} class="field-input__label">{label}</label>
	{/if}

	<div class="field-input__wrapper">
		<input
			class:field-input--has-clear={value}
			{disabled}
			{id}
			{min}
			{max}
			name={id}
			type="number"
			bind:value
			bind:clientHeight={inputHeight} />

		{#if hasStepper}
			<div class="field-input__stepper">
				<button {disabled} type="button" onclick={increment}>
					<Icon name="caret-up" weight="bold" />
				</button>
				<button {disabled} type="button" onclick={decrement}>
					<Icon name="caret-down" weight="bold" />
				</button>
			</div>
		{/if}
	</div>
</div>
