<script lang="ts">
	import './modal-container.scss';
	import { getContext } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut, backOut } from 'svelte/easing';
	import { ModalService } from '$lib/core/state/modal.state.svelte';

	const modalService = getContext<ModalService>('modalService');

	function keyDown(e: KeyboardEvent) {
		if (modalService.modals.length < 1) {
			return;
		}

		if (e?.key === 'Escape' || e?.keyCode === 27) {
			modalService.dismiss(modalService.modals.length - 1);
		}
	}
</script>

{#if modalService && modalService.modals.length > 0}
	<div class="e-modal-container">
		{#each modalService.modals as modal, index (modal.id)}
			<div class="e-modal-container__item">
				<div
					class="e-modal-container__content"
					in:scale={{ delay: 150, duration: 320, start: 0.92, easing: backOut }}
					out:scale={{ duration: 180, start: 0.92, easing: cubicOut }}>
					{#if modal}
						{@const ModalItem = modal.component}
						<ModalItem
							{...modal.props}
							ondismiss={(detail: Promise<unknown>) => modalService.dismiss(index, detail)} />
					{/if}
				</div>

				<div
					class="e-modal-container__backdrop"
					aria-hidden="true"
					onclick={() => modalService.dismiss(index)}
					transition:fade|global={{ duration: 150 }}>
				</div>
			</div>
		{/each}
	</div>
{/if}

<svelte:window on:keydown={keyDown} />
