<script>
	import { habits } from '$lib/stores/habits';
	import { entries } from '$lib/stores/entries';
	import AddHabit from './AddHabit.svelte';
	import HabitCard from './HabitCard.svelte';
</script>

<svelte:head>
	<title>Trackers</title>
	<meta name="description" content="Track your daily habits and activities" />
</svelte:head>

<main>
	<h1 class="text-4xl font-bold text-primary mb-8 text-center">Trackers Prototype</h1>

	<AddHabit />

	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
		{#each $habits as habit (habit.id)}
			<HabitCard {habit} />
		{/each}
	</div>
</main>
