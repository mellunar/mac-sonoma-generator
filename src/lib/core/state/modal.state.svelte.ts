import type { ModalType } from '../interfaces/modal.interface';

export class ModalService {
	modals: ModalType[] = $state([]);

	create(base: ModalType) {
		const body = document.querySelector('body');
		const id = Date.now();
		base.id = id;

		this.modals.push(base);
		body!.style.overflow = this.modals.length > 0 ? 'hidden' : 'initial';

		return {
			onDismiss: new Promise((resolve) => {
				window.addEventListener(
					id.toString(),
					((event: CustomEvent) => {
						resolve(event.detail);
					}) as EventListener,
					{ once: true }
				);
			}),
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dismiss(index: number, data?: any) {
		const body = document.querySelector('body');
		const { id } = this.modals[index];
		this.modals.splice(index, 1);
		body!.style.overflow = this.modals.length > 0 ? 'hidden' : 'initial';

		window.dispatchEvent(
			new CustomEvent(id!.toString(), {
				detail: data,
			})
		);
	}
}
