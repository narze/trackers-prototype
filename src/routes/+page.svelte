<script>
	import { habits } from '$lib/stores/habits';
	import { entries } from '$lib/stores/entries';
	import AddHabit from './AddHabit.svelte';
	import HabitCard from './HabitCard.svelte';
</script>

<svelte:head>
	<title>Habit Tracker</title>
	<meta name="description" content="Track your daily habits and activities" />
</svelte:head>

<main>
	<h1 class="text-4xl font-bold text-primary mb-8 text-center">Habit Tracker</h1>
	
	<AddHabit />
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
		{#each $habits as habit (habit.id)}
			<HabitCard {habit} />
		{/each}
	</div>
</main>