<script lang="ts">
	import '$lib/global.scss';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import formatDate from '$lib/core/functions/format-date.function';
	import { setContext } from 'svelte';
	import { ModalService } from '$lib/core/state/modal.state.svelte';
	import ModalContainer from '$lib/shared/components/modal-container/modal-container.svelte';

	setContext('modalService', new ModalService());

	const navigation: { url: RouteId; name: string }[] = [
		{ url: '/image-frame', name: 'Image Frame' },
		{ url: '/video-frame', name: 'Video Frame' },
		{ url: '/pizza-chart', name: 'Pizza Chart' },
		{ url: '/info-element', name: 'Info Element' },
		//{ url: '/developing', name: 'Developing' },
	];

	let { children } = $props();
	let currentTime = $state(new Date());
	let minutes = $state(-1);

	function updateTime() {
		if (new Date().getMinutes() !== minutes) {
			currentTime = new Date();
		}
	}
</script>

<svelte:head>
	<title>MacOS Sonoma Window Generator</title>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="l-core">
	<div class="l-bar">
		<nav class="l-bar__nav">
			<a href={resolve('/')}><img alt="" src="/favicon.svg" /></a>
			{#each navigation as item (item.url)}
				<a href={resolve(item.url)} class:l-bar__nav--active={page.url.pathname === item.url}>{item.name}</a>
			{/each}
		</nav>

		<div class="l-bar__right">
			<span>{formatDate(currentTime, 'eee')}</span>
			<span>{formatDate(currentTime, 'dd/MMM')}</span>
			<span>{formatDate(currentTime, 'HH:mm')}</span>
		</div>
	</div>
	<main class="l-core__content">
		{@render children()}
	</main>
</div>

<ModalContainer />

<svelte:window on:blur={updateTime} on:focus={updateTime} />
