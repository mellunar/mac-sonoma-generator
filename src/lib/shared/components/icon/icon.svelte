<script lang="ts">
	import './icon.scss';
	import type { IconProps } from './icon.interface';

	let { class: className, name, weight = 'regular', title = '' }: IconProps = $props();
</script>

<i
	class={`icon ph-${name} ${className}`}
	class:ph={weight === 'regular'}
	class:ph-fill={weight === 'fill'}
	class:ph-bold={weight === 'bold'}
	{title}></i>
