<script>
	import { entries } from '$lib/stores/entries';
	import EntryItem from './EntryItem.svelte';
	import HabitGraph from './HabitGraph.svelte';
	
	export let habit;
	
	let note = '';
	let showGraph = false;
	let viewType = 'daily';
	
	function addEntry(value) {
		entries.addEntry({
			habitId: habit.id,
			value,
			note: note.trim() || null
		});
		note = '';
	}

	$: habitEntries = $entries
		.filter(entry => entry.habitId === habit.id)
		.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
</script>

<div class="card bg-base-100 shadow-xl" style="border-top: 4px solid {habit.color}">
	<div class="card-body">
		<div class="flex justify-between items-center">
			<h2 class="card-title" style="color: {habit.color}">{habit.name}</h2>
			<div class="flex gap-2">
				<button 
					class="btn btn-sm btn-ghost" 
					on:click={() => showGraph = !showGraph}
				>
					{showGraph ? '📊' : '📈'}
				</button>
				{#if showGraph}
					<select 
						bind:value={viewType} 
						class="select select-sm select-bordered"
					>
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
					</select>
				{/if}
			</div>
		</div>
		
		{#if showGraph}
			<HabitGraph {habit} {habitEntries} {viewType} />
		{:else}
			<div class="space-y-4">
				<div class="space-y-2">
					{#if habit.type === 'scale'}
						<div class="flex gap-2">
							{#each Array(5) as _, i}
								<button
									on:click={() => addEntry(i + 1)}
									class="btn flex-1"
									style="background-color: {habit.color}; color: white; border: none;"
								>
									{i + 1}
								</button>
							{/each}
						</div>
					{:else}
						<button
							on:click={() => addEntry('time')}
							class="btn w-full"
							style="background-color: {habit.color}; color: white; border: none;"
						>
							Log Time
						</button>
					{/if}
					
					<input
						type="text"
						bind:value={note}
						placeholder="Add note (optional)"
						class="input input-bordered w-full"
					/>
				</div>

				<div class="divide-y">
					{#each habitEntries.slice(0, 5) as entry}
						<EntryItem {entry} habitType={habit.type} habitColor={habit.color} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>