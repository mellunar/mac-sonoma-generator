<script lang="ts">
	import '$lib/styles/mac.scss';
	import './top-bar.scss';

	interface TopBarProps {
		app?: string;
		isFullscreen?: boolean;
		title?: string;
	}

	const apps = ['preview', 'pdf', 'quicktime'];

	let { app = 'generic', isFullscreen = false, title = '' }: TopBarProps = $props();
</script>

<div class="top-bar">
	<div class="top-bar-buttons">
		<div class="top-bar-button"></div>
		<div class="top-bar-button"></div>
		<div class="top-bar-button"></div>
	</div>

	{#if title && (app === 'safari' || app === 'preview' || app === 'pdf')}
		<div class="top-bar-navigation" class:top-bar-fullscreen={isFullscreen}>
			<div class="top-bar-action" class:top-bar-action-disabled={app === 'preview' || app === 'pdf'}>
				<img alt="" src="/mac/chevron-left.svg" />
			</div>
			<div class="top-bar-action top-bar-action-disabled">
				<img alt="" src="/mac/chevron-right.svg" />
			</div>
		</div>
	{/if}

	{#if title}
		<div
			class="top-bar-text"
			class:address-bar={app === 'safari'}
			class:app-title={apps.indexOf(app) > -1}
			class:generic-title={app === 'generic'}>
			{#if app === 'safari'}
				<img alt="" src="/mac/lock.svg" />
			{/if}

			{#if app === 'preview'}
				<img alt="" src="/mac/preview-icon.svg" />
			{/if}

			{#if app === 'quicktime'}
				<img alt="" src="/mac/quicktime-icon.svg" />
			{/if}

			{#if app === 'pdf'}
				<img alt="" src="/mac/pdf-icon.svg" />
			{/if}

			<span>{title}</span>

			{#if app === 'safari'}
				<img alt="" src="/mac/reload.svg" />
			{/if}
		</div>
	{/if}

	<div class="top-bar-actions" class:top-bar-actions-generic={app === 'generic'}>
		{#if title && app === 'safari'}
			<div class="top-bar-action"><img alt="" src="/mac/plus.svg" /></div>
			<div class="top-bar-action"><img alt="" src="/mac/options.svg" /></div>
		{/if}

		{#if title && app === 'preview'}
			<div class="top-bar-action"><img alt="" src="/mac/share.svg" /></div>
			<div class="top-bar-action"><img alt="" src="/mac/sidebar.svg" /></div>
		{/if}

		{#if title && app === 'quicktime'}
			<div class="top-bar-action"><img alt="" src="/mac/share.svg" /></div>
			<div class="top-bar-action"><img alt="" src="/mac/fullscreen.svg" /></div>
		{/if}

		{#if title && app === 'pdf'}
			<div class="top-bar-action"><img alt="" src="/mac/markup.svg" /></div>
			<div class="top-bar-action"><img alt="" src="/mac/share.svg" /></div>
			<div class="top-bar-action"><img alt="" src="/mac/sidebar.svg" /></div>
		{/if}
	</div>
</div>
