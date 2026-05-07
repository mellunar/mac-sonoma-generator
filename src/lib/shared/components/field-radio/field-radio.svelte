<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldRadioProps {
		disabled?: boolean;
		id: string;
		label: string;
		group: string;
		value: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onchange?: any;
	}

	let {
		disabled = false,
		label = '',
		group = $bindable(''),
		value = '',
		id = '',
		onchange = () => {},
	}: FieldRadioProps = $props();
</script>

<label class="field-input__radio" for={id}>
	<input {id} name={id} type="radio" bind:group {disabled} {value} {onchange} />

	<div class="field-input__radio-circle"></div>

	<span>{label}</span>
</label>
