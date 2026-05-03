<script lang="ts">
	import '$lib/styles/mac.scss';
	import exportAsPng from '$lib/core/functions/export-as-png.funcion';
	import TopBar from '$lib/shared/components/top-bar/top-bar.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';
	import FieldTextarea from '$lib/shared/components/field-textarea/field-textarea.svelte';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import BottomBar from '$lib/shared/components/bottom-bar/bottom-bar.svelte';

	let element: HTMLElement;
	let exporting = $state(false);

	let windowTitle = $state('');
	let windowApp = $state('generic');
	let windowSubtitle = $state('');
	let windowBackground = $state('transparent');
	let windowBackgroundCustom = $state('#0A1317');

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
						<span>App:</span>
						<FieldRadio label="Generic" id="generic" value="generic" bind:group={windowApp} />
						<FieldRadio label="Safari" id="safari" value="safari" bind:group={windowApp} />
						<FieldRadio label="Preview" id="preview" value="preview" bind:group={windowApp} />
						<FieldRadio label="QuickTime" id="quicktime" value="quicktime" bind:group={windowApp} />
					</div>

					<div class="form-row">
						<span>Background:</span>
						<FieldRadio label="Transparent" id="transparent" value="transparent" bind:group={windowBackground} />
						<FieldRadio label="White" id="white" value="white" bind:group={windowBackground} />
						<FieldRadio label="Black" id="black" value="black" bind:group={windowBackground} />
						<FieldRadio label="Custom" id="custom" value={windowBackgroundCustom} bind:group={windowBackground} />
					</div>
				</form>

				<div class="form-footer">
					<button class="button button-primary" disabled={exporting} onclick={generateImage}>Save as Image</button>
				</div>
			</div>

			<div class="shadow"></div>
		</div>
	</div>
</div>

<div class="l-printable-window l-printable-window--fullscreen" bind:this={element}>
	<div class="window">
		<div class="window window-clip">
			<TopBar app={windowApp} title={windowTitle} />

			<div class="content content-fullscreen" style:--window-bg={windowBackground}></div>

			<BottomBar content={windowSubtitle} />
		</div>

		<div class="shadow"></div>
	</div>
</div>
