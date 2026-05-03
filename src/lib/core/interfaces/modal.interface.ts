import type { Component, ComponentProps } from 'svelte';

export interface ModalType<T extends Component = Component> {
	component: T;
	props?: ComponentProps<T>;
	id?: number;
}
