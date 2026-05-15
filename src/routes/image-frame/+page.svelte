<script lang="ts">
	import exportAsPng from '$lib/core/functions/export-as-png.funcion';
	import TopBar from '$lib/shared/components/top-bar/top-bar.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';
	import FieldTextarea from '$lib/shared/components/field-textarea/field-textarea.svelte';
	import BottomBar from '$lib/shared/components/bottom-bar/bottom-bar.svelte';
	import FieldCheckbox from '$lib/shared/components/field-checkbox/field-checkbox.svelte';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import FormImage from '$lib/shared/components/form-image/form-image.svelte';
	import type { FormImageSource } from '$lib/shared/components/form-image/form-image.interface';

	let element: HTMLElement;
	let exporting = $state(false);

	let windowTitle = $state('');
	let windowApp = $state('generic');
	let windowSubtitle = $state('');
	let isFullscreen = $state(true);
	let hasMinimumSizes = $state(false);
	let windowBackground = $state('white');
	let windowBackgroundCustom = $state('#0A1317');
	let isAi = $state(false);
	let shouldCover = $state(false);
	let imgSource: FormImageSource = $state('input');
	let imgUrl = $state('https://placehold.co/264x354');
	let imgHeight: number | undefined = $state();
	let imgWidth: number | undefined = $state();
	let containerWidth: number | undefined = $state();

	async function generateImage() {
		if (exporting) return;

		exporting = true;

		await exportAsPng(element).finally(() => {
			exporting = false;
		});
	}
</script>

<div class="l-printable-window--form">
	<div class="window">
		<div class="window window-clip">
			<TopBar title="Config" />

			<div class="content form-window" style="--window-bg: var(--white)">
				<form class="form">
					<FieldInput id="windowTitle" label="Window Title:" bind:value={windowTitle} />

					<FieldTextarea id="windowSubtitle" label="Window Subtitle:" bind:value={windowSubtitle} />

					<div class="form-row">
						<FieldCheckbox id="isFullscreen" label="Is Fullscreen?" bind:checked={isFullscreen} />
						<FieldCheckbox
							id="hasMinimumSizes"
							label="Has Minimum Sizes?"
							disabled={!isFullscreen}
							bind:checked={hasMinimumSizes} />
						<FieldCheckbox id="shouldCover" label="Should Image Cover?" bind:checked={shouldCover} />
						<FieldCheckbox id="isAi" label="Is AI?" bind:checked={isAi} />
					</div>

					<div class="form-row">
						<span>App:</span>
						<FieldRadio label="Generic" id="generic" value="generic" bind:group={windowApp} />
						<FieldRadio label="Safari" id="safari" value="safari" bind:group={windowApp} />
						<FieldRadio label="Preview" id="preview" value="preview" bind:group={windowApp} />
						<FieldRadio label="QuickTime" id="quicktime" value="quicktime" bind:group={windowApp} />
						<FieldRadio label="PDF" id="pdf" value="pdf" bind:group={windowApp} />
					</div>

					<div class="form-row">
						<span>Background:</span>
						<FieldRadio label="Transparent" id="transparent" value="transparent" bind:group={windowBackground} />
						<FieldRadio label="White" id="white" value="white" bind:group={windowBackground} />
						<FieldRadio label="Black" id="black" value="black" bind:group={windowBackground} />
						<FieldRadio label="Custom" id="custom" value={windowBackgroundCustom} bind:group={windowBackground} />
					</div>

					{#if windowBackground === windowBackgroundCustom}
						<FieldInput
							id="windowBackgroundCustom"
							label="Custom Background Color:"
							bind:value={windowBackgroundCustom} />
					{/if}

					<FormImage bind:imgUrl bind:imgSource nullable={false} />
				</form>

				<div class="form-footer">
					<button class="button button-primary" disabled={exporting} onclick={generateImage}>Save as Image</button>
				</div>
			</div>
		</div>

		<div class="shadow"></div>
	</div>
</div>

<div class="l-printable-window" class:l-printable-window--fullscreen={isFullscreen} bind:this={element}>
	<div class="window">
		<div class="window window-clip">
			<TopBar app={windowApp} title={windowTitle} />

			<div
				class="content"
				class:content-fullscreen={isFullscreen && hasMinimumSizes}
				class:content-ai={isAi}
				style:--window-bg={windowBackground}
				style:--image-size={containerWidth}
				bind:clientWidth={containerWidth}>
				<img
					alt=""
					src={imgUrl}
					draggable="false"
					class:object-cover={shouldCover}
					class:limit-height={imgHeight && imgHeight >= 900}
					class:limit-width={imgWidth && imgWidth >= 1600}
					bind:naturalHeight={imgHeight}
					bind:naturalWidth={imgWidth} />
			</div>

			<BottomBar content={windowSubtitle} />
		</div>

		{#if isFullscreen}
			<div class="shadow"></div>
		{/if}
	</div>
</div>
