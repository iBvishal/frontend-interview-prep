const STORAGE_KEY = 'board_state_v1';
import type { BoardState } from './types.js';

export function loadState(): BoardState | null {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return null;
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to load state from localStorage", e);
        return null;
    }
}

export function saveState(state: BoardState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state to localStorage", e);
    }
}
