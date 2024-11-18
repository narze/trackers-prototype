import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'habit-tracker-data';

const defaultHabits = [
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

function createHabitStore() {
  let initialHabits = defaultHabits;
  
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      initialHabits = JSON.parse(stored);
    }
  }

  const { subscribe, set, update } = writable(initialHabits);

  return {
    subscribe,
    addHabit: (habit) => {
      update(habits => {
        const newHabits = [...habits, { ...habit, id: crypto.randomUUID() }];
        if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
        return newHabits;
      });
    },
    deleteHabit: (id) => {
      update(habits => {
        const newHabits = habits.filter(h => h.id !== id);
        if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
        return newHabits;
      });
    }
  };
}

export const habits = createHabitStore();