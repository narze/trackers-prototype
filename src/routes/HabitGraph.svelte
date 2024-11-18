<script>
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } from 'date-fns';

	export let habit;
	export let habitEntries;
	export let viewType;

	let canvas;
	let chart;

	$: if (chart) {
		updateChart();
	}

	onMount(() => {
		createChart();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	function createChart() {
		const ctx = canvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: getChartData(),
			options: {
				responsive: true,
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
		chart.data = getChartData();
		chart.update();
	}

	function getChartData() {
		const now = new Date();
		let dates = [];
		let values = [];

		if (viewType === 'daily') {
			// Last 7 days
			dates = Array.from({ length: 7 }, (_, i) => {
				const date = new Date();
				date.setDate(date.getDate() - (6 - i));
				return format(date, 'MM/dd');
			});

			values = dates.map(date => {
				const dayEntries = habitEntries.filter(entry => 
					format(new Date(entry.timestamp), 'MM/dd') === date
				);
				if (dayEntries.length === 0) return null;
				if (habit.type === 'time') return dayEntries.length;
				return dayEntries.reduce((acc, curr) => acc + curr.value, 0) / dayEntries.length;
			});
		} else {
			// Last 4 weeks
			const weeks = Array.from({ length: 4 }, (_, i) => subWeeks(now, 3 - i));
			dates = weeks.map(week => format(week, 'MM/dd'));

			values = weeks.map(weekStart => {
				const weekEnd = endOfWeek(weekStart);
				const weekEntries = habitEntries.filter(entry => {
					const entryDate = new Date(entry.timestamp);
					return entryDate >= weekStart && entryDate <= weekEnd;
				});
				if (weekEntries.length === 0) return null;
				if (habit.type === 'time') return weekEntries.length;
				return weekEntries.reduce((acc, curr) => acc + curr.value, 0) / weekEntries.length;
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
				pointRadius: 4,
				pointHoverRadius: 6
			}]
		};
	}
</script>

<div class="w-full h-[200px]">
	<canvas bind:this={canvas}></canvas>
</div>