<script lang="ts">
	import { run } from 'svelte/legacy';
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import {
		startOfDay,
		endOfDay,
		startOfWeek,
		endOfWeek,
		format,
		addWeeks,
		subWeeks,
		addDays,
		subDays,
		isWithinInterval,
		parseISO
	} from 'date-fns';
	import type { Entry, Habit } from '$lib/types';

	let { habit, habitEntries, viewType } = $props<{
		habit: Habit;
		habitEntries: Entry[];
		viewType: 'daily' | 'weekly';
	}>();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let chart = $state<Chart | null>(null);
	let currentDate = $state(new Date());

	onMount(() => {
		if (canvas) {
			createChart();
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	function createChart() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		chart = new Chart(ctx, {
			type: 'line',
			data: getChartData(),
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						max: habit.type === 'scale' ? 5 : undefined
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	}

	function updateChart() {
		if (!chart) return;
		chart.data = getChartData();
		chart.update();
	}

	function getChartData() {
		let dates: string[] = [];
		let values: (number | null)[] = [];

		if (viewType === 'daily') {
			const dayStart = startOfDay(currentDate);
			const dayEnd = endOfDay(currentDate);

			// Get all entries for the current day
			const dayEntries = habitEntries
				.filter((entry: Entry) => {
					const entryDate = parseISO(entry.timestamp);
					return isWithinInterval(entryDate, { start: dayStart, end: dayEnd });
				})
				.sort((a: Entry, b: Entry) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());

			if (dayEntries.length > 0) {
				// Use actual entry timestamps for x-axis
				dates = dayEntries.map((entry: Entry) => {
					const entryDate = parseISO(entry.timestamp);
					return format(entryDate, 'HH:mm');
				});

				// Use actual entry values
				values = dayEntries.map((entry: Entry) => {
					if (habit.type === 'time') return 1;
					return entry.value;
				});
			} else {
				// If no entries, show empty 24-hour timeline
				dates = Array.from({ length: 24 }, (_, i) => {
					return format(new Date().setHours(i, 0, 0, 0), 'HH:mm');
				});
				values = Array(24).fill(null);
			}
		} else {
			// Show entries for 7 days of the current week
			const weekStart = startOfWeek(currentDate);
			dates = Array.from({ length: 7 }, (_, i) => {
				const date = addDays(weekStart, i);
				return format(date, 'EEE');
			});

			values = dates.map((_, index) => {
				const dayDate = addDays(weekStart, index);
				const dayStart = startOfDay(dayDate);
				const dayEnd = endOfDay(dayDate);

				const dayEntries = habitEntries.filter((entry: Entry) => {
					const entryDate = parseISO(entry.timestamp);
					return isWithinInterval(entryDate, { start: dayStart, end: dayEnd });
				});

				if (dayEntries.length === 0) return null;
				if (habit.type === 'time') return dayEntries.length;
				return dayEntries.reduce((acc: number, curr: Entry) => acc + curr.value, 0) / dayEntries.length;
			});
		}

		return {
			labels: dates,
			datasets: [{
				data: values,
				borderColor: habit.color,
				backgroundColor: habit.color + '40',
				fill: true,
				tension: 0.4,
				pointRadius: 0,
				pointHoverRadius: 3
			}]
		};
	}

	function navigateDay(direction: 'next' | 'prev') {
		currentDate = direction === 'next'
			? addDays(currentDate, 1)
			: subDays(currentDate, 1);
	}

	function navigateWeek(direction: 'next' | 'prev') {
		currentDate = direction === 'next'
			? addWeeks(currentDate, 1)
			: subWeeks(currentDate, 1);
	}

	function getDateRangeText() {
		if (viewType === 'daily') {
			return format(currentDate, 'MMMM d, yyyy');
		} else {
			const weekStart = startOfWeek(currentDate);
			const weekEnd = endOfWeek(currentDate);
			return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
		}
	}

	run(() => {
		if (chart) {
			updateChart();
		}
	});
</script>

<div class="w-full space-y-2">
	<div class="flex justify-between items-center">
		<button
			class="btn btn-sm btn-ghost"
			onclick={() => viewType === 'daily' ? navigateDay('prev') : navigateWeek('prev')}
		>
			←
		</button>
		<span class="text-sm font-medium">
			{getDateRangeText()}
		</span>
		<button
			class="btn btn-sm btn-ghost"
			onclick={() => viewType === 'daily' ? navigateDay('next') : navigateWeek('next')}
		>
			→
		</button>
	</div>
	<div class="w-full h-[300px]">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
