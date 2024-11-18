import { json } from '@sveltejs/kit';

let habits = [
	{
		id: '1',
		name: 'Energy',
		type: 'scale',
		color: '#FF5733'
	},
	{
		id: '2',
		name: 'Mood',
		type: 'scale',
		color: '#33FF57'
	},
	{
		id: '3',
		name: 'Meal',
		type: 'time',
		color: '#3357FF'
	}
];

export async function GET() {
	return json(habits);
}

export async function POST({ request }) {
	const habit = await request.json();
	habit.id = crypto.randomUUID();
	habits = [...habits, habit];
	return json(habit);
}

export async function DELETE({ url }) {
	const id = url.searchParams.get('id');
	habits = habits.filter(h => h.id !== id);
	return json({ success: true });
}