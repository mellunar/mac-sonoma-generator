<script lang="ts">
	import '$lib/styles/mac.scss';
	import './pizza-chart.scss';
	import { getContext } from 'svelte';
	import exportAsPng from '$lib/core/functions/export-as-png.funcion';
	import type { ChartData, ChartItem } from './pizza-chart.interface';
	import { chartPalette } from './pizza-chart.config';
	import Chart from 'chart.js/auto';
	import TopBar from '$lib/shared/components/top-bar/top-bar.svelte';
	import FieldInput from '$lib/shared/components/field-input/field-input.svelte';
	import FieldRadio from '$lib/shared/components/field-radio/field-radio.svelte';
	import FieldCheckbox from '$lib/shared/components/field-checkbox/field-checkbox.svelte';
	import FieldTextarea from '$lib/shared/components/field-textarea/field-textarea.svelte';
	import BottomBar from '$lib/shared/components/bottom-bar/bottom-bar.svelte';
	import Icon from '$lib/shared/components/icon/icon.svelte';
	import FieldNumber from '$lib/shared/components/field-number/field-number.svelte';
	import type { ModalService } from '$lib/core/state/modal.state.svelte';
	import LoadJsonModal from '$lib/core/modules/pizza-chart/components/load-json-modal.svelte';

	const chartConfig = {
		currency: '', // deixe vazio '' para valores sem símbolo
		decimals: 0, // casas decimais quando necessário
		unit: '', // sufixo opcional, ex: 'kg', 'pts', 'h'
	};

	const modalService = getContext<ModalService>('modalService');

	let element: HTMLElement;
	let canvas: HTMLCanvasElement;
	let chart: Chart;
	let exporting = $state(true);
	let chartData: ChartData[] = $state([{ label: '', value: 0 }]);

	let windowTitle = $state('');
	let windowApp = $state('generic');
	let windowSubtitle = $state('');
	let isFullscreen = $state(false);
	let showSummary = $state(true);

	let chartItems: ChartItem[] = $state([]);
	let chartTotalValue: number | string = $state(0);
	let summaryCategories: number | string = $state(0);
	let summaryMaxValue: number = $state(0);
	let summaryAverageValue: number = $state(0);

	// Formata qualquer número de forma legível, sem forçar "K"
	function formatValues(val: number) {
		const pre = chartConfig.currency ? chartConfig.currency + '\u00A0' : '';
		const post = chartConfig.unit ? '\u00A0' + chartConfig.unit : '';
		let num;

		if (Math.abs(val) >= 1e9) {
			num = (val / 1e9).toFixed(chartConfig.decimals) + 'B';
		} else if (Math.abs(val) >= 1e6) {
			num = (val / 1e6).toFixed(chartConfig.decimals) + 'M';
		} else if (Math.abs(val) >= 1000) {
			num = (val / 1000).toFixed(chartConfig.decimals) + 'K';
		} else {
			// Abaixo de 1 000: mostra o valor exato, sem casas decimais desnecessárias
			num = Number.isInteger(val) ? val.toString() : val.toFixed(chartConfig.decimals).toString();
		}

		return pre + num + post;
	}

	function emptyRow(): ChartData {
		return { label: '', value: 0 };
	}

	function addRow() {
		chartData.push(emptyRow());
	}

	function removeRow(index: number) {
		if (chartData.length < 2) return;

		chartData.splice(index, 1);
	}

	function clearChart() {
		if (chartData.length < 2) return;
		chartData = [emptyRow()];
	}

	function buildChart() {
		const total = chartData.reduce((s, d) => s + d.value, 0);
		const maxVal = Math.max(...chartData.map((d) => d.value));
		const items = chartData.map((d, i) => ({
			legendColor: chartPalette[i % chartPalette.length].color,
			legendRank: i + 1,
			legendName: d.label,
			legendBar: (d.value / maxVal) * 100,
			legendPercentage: Number(((d.value / total) * 100).toFixed(1)),
			legendPctColor: chartPalette[i % chartPalette.length].text,
			legendValue: d.value,
		}));

		chartItems = items;
		chartTotalValue = formatValues(total);
		summaryCategories = chartData.length;
		summaryMaxValue = Number(items.find((d) => d.legendValue === maxVal)!.legendPercentage);
		summaryAverageValue = Number((100 / chartData.length).toFixed(1));

		if (chart) {
			chart.destroy();
		}

		chart = new Chart(canvas, {
			type: 'doughnut',
			data: {
				labels: items.map((s) => s.legendName),
				datasets: [
					{
						data: items.map((s) => s.legendPercentage),
						backgroundColor: items.map((s) => s.legendColor),
						borderWidth: 2.5,
						borderColor: 'rgba(255,255,255,0.95)',
						hoverBorderWidth: 2.5,
						hoverOffset: 10,
					},
				],
			},
			options: {
				responsive: true,
				cutout: '60%',
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: 'rgba(255,255,255,0.97)',
						titleColor: 'rgba(0,0,0,0.8)',
						bodyColor: 'rgba(0,0,0,0.5)',
						borderColor: 'rgba(0,0,0,0.1)',
						borderWidth: 1,
						cornerRadius: 10,
						padding: 10,
						displayColors: false,
						callbacks: {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							title: (ctx: any) => ctx[0].label,
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							label: (ctx: any) => {
								const item = items[ctx.dataIndex];
								return ' ' + item.legendPercentage.toFixed(1) + '%  ·  ' + formatValues(item.legendValue);
							},
						},
					},
				},
				animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
			},
		});
	}

	async function generateImage() {
		if (exporting) return;

		exporting = true;

		await exportAsPng(element).finally(() => {
			exporting = false;
		});
	}

	async function openJsonModal() {
		const modal = modalService.create({
			component: LoadJsonModal,
		});

		await modal.onDismiss.then((data: unknown) => {
			if (data) {
				chartData = data as ChartData[];
				buildChart();
			}
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
						<FieldCheckbox id="showSummary" label="Show Summary?" bind:checked={showSummary} />
					</div>

					<div class="form-row">
						<span>App:</span>
						<FieldRadio label="Generic" id="generic" value="generic" bind:group={windowApp} />
						<FieldRadio label="Safari" id="safari" value="safari" bind:group={windowApp} />
						<FieldRadio label="Preview" id="preview" value="preview" bind:group={windowApp} />
						<FieldRadio label="QuickTime" id="quicktime" value="quicktime" bind:group={windowApp} />
					</div>

					{#each chartData as formItem, index (`chart-form-${index}`)}
						<div class="form-row chart-form-row">
							<FieldInput id={`chart-form-${index}`} label="Label" bind:value={formItem.label} />

							<FieldNumber id={`chart-value-${index}`} label="Value" min={0} bind:value={formItem.value} />

							<button
								class="button button-destructive chart-form-row-button align-bottom"
								title="delete"
								type="button"
								onclick={() => removeRow(index)}>
								<Icon name="x" />
							</button>
						</div>
					{/each}
				</form>

				<div class="form-footer">
					<button class="button button-default" onclick={openJsonModal}>Add From JSON</button>
					<button class="button button-default" onclick={addRow}>Add Item</button>
					<button class="button button-default" onclick={buildChart}>Build Chart</button>
					<button class="button button-destructive" disabled={chartData.length < 2} onclick={clearChart}
						>Clear Chart</button>
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
				class="content chart-container"
				class:content-fullscreen={isFullscreen}
				style="--window-bg: var(--white)">
				<div class="chart-content">
					<div class="chart-panel">
						<div class="chart-wrap">
							<canvas id="pie" width="220" height="220" bind:this={canvas}></canvas>
							<div class="center-label">
								<div class="c-lbl">Total</div>
								<div class="c-val" id="cval">{chartTotalValue}</div>
							</div>

							{#if showSummary}
								<div class="summary">
									<div class="sum-card">
										<div class="sum-label">Categ.</div>
										<div class="sum-value" id="s-cat">
											{summaryCategories}
										</div>
									</div>
									<div class="sum-card">
										<div class="sum-label">Maior</div>
										<div class="sum-value" id="s-max">
											{summaryMaxValue}%
										</div>
									</div>
									<div class="sum-card">
										<div class="sum-label">Média</div>
										<div class="sum-value" id="s-avg">
											{summaryAverageValue}%
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<div id="legend" class="legend-panel">
						{#if chartItems.length > 0}
							{#each chartItems as chartItem, index (index)}
								<div id={'leg-' + index} class="leg-item">
									<span class="leg-rank">{index + 1}</span>
									<span class="leg-dot" style={`background:${chartItem.legendColor}`}></span>
									<span class="leg-name">{chartItem.legendName}</span>
									<div class="leg-bar-wrap">
										<div
											class="leg-bar"
											style={`width: ${chartItem.legendBar}%; background: ${chartItem.legendColor}`}>
										</div>
									</div>
									<span class="leg-pct" style="color: ${chartItem.legendPctColor}">
										{chartItem.legendPercentage}%
									</span>
									<span class="leg-val">{formatValues(chartItem.legendValue)}</span>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<BottomBar content={windowSubtitle} />
		</div>

		{#if isFullscreen}
			<div class="shadow"></div>
		{/if}
	</div>
</div>
