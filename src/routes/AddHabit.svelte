<script>
	import { habits } from '$lib/stores/habits';

	let name = '';
	let type = 'scale';
	let color = '#FF5733';

	function handleSubmit() {
		if (name.trim()) {
			habits.addHabit({ name, type, color });
			name = '';
			type = 'scale';
			color = '#FF5733';
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col sm:flex-row gap-4">
			<input
				type="text"
				bind:value={name}
				placeholder="New habit name..."
				class="input input-bordered flex-1"
				required
			/>
			
			<select bind:value={type} class="select select-bordered">
				<option value="scale">Scale (1-5)</option>
				<option value="time">Time only</option>
			</select>

			<input
				type="color"
				bind:value={color}
				title="Choose habit color"
				class="w-12 h-12 rounded cursor-pointer"
			/>

			<button type="submit" class="btn btn-primary">Add Habit</button>
		</form>
	</div>
</div>