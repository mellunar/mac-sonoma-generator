<script lang="ts">
	import type { FormImageSource } from './form-image.interface';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import FieldFile from '$lib/shared/components/field-file/field-file.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';

	interface FormImageProps {
		imgUrl: string;
		imgSource: FormImageSource;
		nullable?: boolean;
	}

	let { imgUrl = $bindable(''), imgSource = $bindable('input'), nullable = true }: FormImageProps = $props();

	function resetImage() {
		imgUrl = imgSource === 'none' ? '' : 'https://placehold.co/264x354';
	}

	function handleFile(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files![0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			imgUrl = e.target!.result as string;
		};

		reader.readAsDataURL(file);
	}

	async function parseClipboardData() {
		const items = await navigator.clipboard.read().catch((err) => {
			console.error(err);
		});

		if (!items || items.length < 1) {
			return;
		}

		for (let item of items as ClipboardItems) {
			for (let type of item.types) {
				if (type.startsWith('image/')) {
					item.getType(type).then((imageBlob) => {
						imgUrl = window.URL.createObjectURL(imageBlob);
					});
					return true;
				}
			}
		}
	}
</script>

<div class="form-row">
	<span>Image Source:</span>
	{#if nullable}
		<FieldRadio label="None" id="img-source-none" value="none" onchange={resetImage} bind:group={imgSource} />
	{/if}
	<FieldRadio label="Input" id="img-source-input" value="input" onchange={resetImage} bind:group={imgSource} />
	<FieldRadio label="URL" id="img-source-url" value="url" onchange={resetImage} bind:group={imgSource} />
	<FieldRadio label="Paste" id="img-source-paste" value="paste" onchange={resetImage} bind:group={imgSource} />
</div>

{#if imgSource === 'input'}
	<div class="form-item">
		<FieldFile accept="image/*" id="imageToHandle" handleFiles={handleFile} />
	</div>
{:else if imgSource === 'url'}
	<FieldInput id="imgSourceUrl" label="URL:" bind:value={imgUrl} />
{:else}
	<button class="button button-default" type="button" onclick={parseClipboardData}>Paste</button>
{/if}
