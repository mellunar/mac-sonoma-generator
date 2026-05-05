<script lang="ts">
	import '$lib/styles/mac.scss';
	import exportAsPng from '$lib/core/functions/export-as-png.funcion';
	import TopBar from '$lib/shared/components/top-bar/top-bar.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import FieldCheckbox from '$lib/shared/components/field-checkbox/field-checkbox.svelte';

	let element: HTMLElement;
	let exporting = $state(false);

	let textType = $state('tooltip');
	let textPrimary = $state('');
	let textSecondary = $state('');
	let isFullscreen = $state(true);
	let insideWindow = $state(false);

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
					<div class="form-row">
						<FieldCheckbox id="isFullscreen" label="Is Fullscreen?" bind:checked={isFullscreen} />
					</div>

					<div class="form-row">
						<span>Element:</span>
						<FieldRadio label="Popover" id="popover" value="popover" bind:group={textType} />
						<FieldRadio label="Tooltip" id="tooltip" value="tooltip" bind:group={textType} />
						<FieldRadio label="Notification" id="notification" value="notification" bind:group={textType} />
					</div>

					<FieldInput id="textPrimary" label="Primary Text:" bind:value={textPrimary} />

					{#if textType === 'notification'}
						<FieldInput id="textSecondary" label="Secondary Text:" bind:value={textSecondary} />
					{/if}

					{#if textType === 'popover' || textType === 'notification'}
						<div class="form-row">
							<FieldCheckbox id="insideWindow" label="Is Inside Window?" bind:checked={insideWindow} />
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

<div class="l-printable-window" class:l-printable-window--fullscreen={isFullscreen} bind:this={element}>
	<div class="window info-element" class:info-element-tr={textType === 'notification'}>
		<div
			class:info-element-popover={textType === 'popover'}
			class:info-element-popover-inside={textType === 'popover' && insideWindow}
			class:info-element-notification={textType === 'notification'}
			class:info-element-notification-inside={textType === 'notification' && insideWindow}
			class:info-element-tooltip={textType === 'tooltip'}>
			<div class="info-element-text">
				<div class="info-element-primary">
					{textPrimary}
				</div>

				{#if textType === 'notification'}
					<div class="info-element-secondary">
						{textSecondary}
					</div>
				{/if}
			</div>

			{#if textType === 'notification'}
				<div class="info-element-right">agora</div>
			{/if}
		</div>
	</div>
</div>
