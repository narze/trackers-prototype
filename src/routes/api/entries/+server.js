import { json } from '@sveltejs/kit';

let entries = [];

export async function GET() {
	return json(entries);
}

export async function POST({ request }) {
	const entry = await request.json();
	entry.id = crypto.randomUUID();
	entry.timestamp = new Date().toISOString();
	entries = [...entries, entry];
	return json(entry);
}

export async function PUT({ request }) {
	const { id, ...updates } = await request.json();
	entries = entries.map(entry => 
		entry.id === id ? { ...entry, ...updates } : entry
	);
	return json({ success: true });
}

export async function DELETE({ url }) {
	const id = url.searchParams.get('id');
	entries = entries.filter(e => e.id !== id);
	return json({ success: true });
}