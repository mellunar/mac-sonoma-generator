<script lang="ts">
	import '$lib/styles/field.scss';

	interface FieldFileProps {
		accept?: string;
		id: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		handleFiles: any;
	}

	let { accept = '*', id, handleFiles }: FieldFileProps = $props();
</script>

<label class="field-input__file">
	<input {accept} {id} type="file" onchange={handleFiles} />
</label>
