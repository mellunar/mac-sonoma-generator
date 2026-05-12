<script lang="ts">
	import '$lib/styles/mac.scss';
	import '$lib/styles/alert-page.scss';
	import exportAsPng from '$lib/core/functions/export-as-png.funcion';
	import TopBar from '$lib/shared/components/top-bar/top-bar.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import FieldTextarea from '$lib/shared/components/field-textarea/field-textarea.svelte';
	import Icon from '$lib/shared/components/icon/icon.svelte';
	import FieldFile from '$lib/shared/components/field-file/field-file.svelte';

	let element: HTMLElement;
	let exporting = $state(false);

	let alertTitle = $state('Observação');
	let alertContent = $state('');
	let alertIconType = $state('none');
	let alertIcon = $state('');
	let alertIconStyle: 'regular' | 'fill' | 'bold' = $state('regular');
	let alertMode = $state('shadow');

	function resetIcon() {
		alertIcon = '';
		alertIconStyle = 'regular';
	}

	function handleFile(event: Event & { currentTarget: HTMLInputElement }) {
		const file = event.currentTarget.files![0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			alertIcon = e.target!.result as string;
		};

		reader.readAsDataURL(file);
	}

	async function generateImage() {
		if (exporting) return;

		exporting = true;

		await document.fonts.ready;
		await new Promise((r) => requestAnimationFrame(r));
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
					<FieldInput id="alertTitle" label="Alert Title:" bind:value={alertTitle} />

					<FieldTextarea id="alertContent" label="Alert Content:" bind:value={alertContent} />

					<div class="form-row">
						<span>Alert Mode:</span>
						<FieldRadio label="Undecorated" id="mode-blank" value="blank" bind:group={alertMode} />
						<FieldRadio label="Shadow" id="mode-shadow" value="shadow" bind:group={alertMode} />
						<FieldRadio label="Fullscreen" id="mode-fullscreen" value="fullscreen" bind:group={alertMode} />
					</div>

					<div class="form-row">
						<span>Alert Icon Type:</span>
						<FieldRadio label="None" id="icon-none" value="none" onchange={resetIcon} bind:group={alertIconType} />
						<FieldRadio label="Icon" id="icon-icon" value="icon" onchange={resetIcon} bind:group={alertIconType} />
						<FieldRadio label="URL" id="icon-url" value="url" onchange={resetIcon} bind:group={alertIconType} />
						<FieldRadio
							label="Image"
							id="icon-image"
							value="image"
							onchange={resetIcon}
							bind:group={alertIconType} />
					</div>

					{#if alertIconType === 'icon'}
						<FieldInput id="alertIcon" label="Phosphoricon Icon Name:" bind:value={alertIcon} />

						<div class="form-row">
							<span>Alert Icon Style:</span>
							<FieldRadio label="Regular" id="icon-style-regular" value="regular" bind:group={alertIconStyle} />
							<FieldRadio label="Fill" id="icon-style-fill" value="fill" bind:group={alertIconStyle} />
							<FieldRadio label="Bold" id="icon-style-bold" value="bold" bind:group={alertIconStyle} />
						</div>
					{/if}

					{#if alertIconType === 'url'}
						<FieldInput id="alertUrl" label="URL:" bind:value={alertIcon} />
					{/if}

					{#if alertIconType === 'image'}
						<div class="form-item">
							<FieldFile accept="image/*" id="imageToHandle" handleFiles={handleFile} />
						</div>
					{/if}
				</form>

				<div class="form-footer">
					<button class="button button-primary" disabled={exporting} onclick={generateImage}>Save as Image</button>
				</div>
			</div>
		</div>

		<div class="shadow"></div>
	</div>
</div>

<div
	class="l-printable-window"
	class:l-printable-window--fullscreen={alertMode === 'fullscreen'}
	class:l-printable-window--padding={alertMode === 'shadow'}
	bind:this={element}>
	<div class="alert-page">
		{#if alertIcon !== '' && alertIconType === 'icon'}
			<div class="alert-page__icon">
				<span><Icon name={alertIcon} weight={alertIconStyle} /></span>
			</div>
		{/if}

		{#if alertIcon !== '' && (alertIconType === 'url' || alertIconType === 'image')}
			<div class="alert-page__icon">
				<img alt="" src={alertIcon} />
			</div>
		{/if}

		{#if alertTitle}
			<p class="alert-page__title">{alertTitle}</p>
		{/if}

		{#if alertContent}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="alert-page__content">{@html alertContent}</p>
		{/if}
	</div>
</div>
