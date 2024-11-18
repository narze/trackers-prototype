import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'habit-tracker-entries';

function createEntryStore() {
  let initialEntries = [];
  
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      initialEntries = JSON.parse(stored);
    }
  }

  const { subscribe, set, update } = writable(initialEntries);

  return {
    subscribe,
    addEntry: (entry) => {
      update(entries => {
        const newEntries = [...entries, { 
          ...entry, 
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }];
        if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
        return newEntries;
      });
    },
    updateEntry: (id, updates) => {
      update(entries => {
        const newEntries = entries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        );
        if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
        return newEntries;
      });
    },
    deleteEntry: (id) => {
      update(entries => {
        const newEntries = entries.filter(e => e.id !== id);
        if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
        return newEntries;
      });
    }
  };
}

export const entries = createEntryStore();