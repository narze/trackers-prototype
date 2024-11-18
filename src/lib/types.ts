export type Entry = {
	id: string;
	habitId: string;
	value: number;
	timestamp: string;
	note?: string | null;
};

export type Habit = {
	id: string;
	type: 'scale' | 'time';
	color: string;
	name: string;
};
