<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldCheckboxProps {
		disabled?: boolean;
		id: string;
		label?: string;
		checked: boolean;
	}

	let { disabled = false, id = '', label = '', checked = $bindable(false) }: FieldCheckboxProps = $props();
</script>

<label class="field-input__checkbox" for={id}>
	<input {id} name={id} type="checkbox" bind:checked {disabled} />

	<div class="field-input__checkbox-box">
		<img alt="" src="/mac/checkmark.svg" draggable="false" />
	</div>

	<span>{label}</span>
</label>
