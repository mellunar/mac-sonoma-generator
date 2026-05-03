<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldRadioProps {
		disabled?: boolean;
		id: string;
		label: string;
		group: string;
		value: string;
	}

	let { disabled = false, label = '', group = $bindable(''), value = '', id = '' }: FieldRadioProps = $props();
</script>

<label class="field-input__radio" for={id}>
	<input {id} name={id} type="radio" bind:group {disabled} {value} />

	<div class="field-input__radio-circle"></div>

	<span>{label}</span>
</label>
