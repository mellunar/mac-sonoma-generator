<script lang="ts">
	import '$lib/global.scss';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import formatDate from '$lib/core/functions/format-date.function';
	import { onMount } from 'svelte';

	const navigation: { url: RouteId; name: string }[] = [
		{ url: '/image-frame', name: 'Image Frame' },
		{ url: '/video-frame', name: 'Video Frame' },
		{ url: '/pizza-chart', name: 'Pizza Chart' },
	];

	let { children } = $props();
	let currentTime = $state(new Date());
	let minutes = $state(-1);
	let hasFocus = $state(false);

	onMount(() => {
		hasFocus = true;
		updateTime();
	});

	function updateTime() {
		if (hasFocus && new Date().getMinutes() !== minutes) {
			currentTime = new Date();
		}

		setInterval(() => {
			updateTime();
		}, 1000);
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

<svelte:window
	on:blur={() => {
		hasFocus = false;
	}}
	on:focus={() => {
		hasFocus = true;
	}} />
