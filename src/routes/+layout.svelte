<script>
	import '../app.css';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="min-h-screen bg-base-200">
	<div class="container mx-auto px-4 py-8">
		{@render children?.()}
	</div>
</div>