import type { BoardState } from './types.js';

const NOW = Date.now();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const initialBoardState: BoardState = {
  cards: {
    'card-1': {
      id: 'card-1',
      text: 'Design color palette and typography system',
      createdBy: 'Sarah Chen',
      createdAt: NOW - 4 * HOUR,
      updatedAt: NOW - 3 * HOUR,
      isDeleted: null
    },
    'card-2': {
      id: 'card-2',
      text: 'Integrate HTML5 Drag and Drop API',
      createdBy: 'Marcus Vance',
      createdAt: NOW - 2 * HOUR,
      updatedAt: NOW - 1 * HOUR,
      isDeleted: null
    },
    'card-3': {
      id: 'card-3',
      text: 'Add keyboard accessibility (Tab navigation and Enter to edit)',
      createdBy: 'Elena Rostova',
      createdAt: NOW - 90 * MINUTE,
      updatedAt: NOW - 90 * MINUTE,
      isDeleted: null
    },
    'card-4': {
      id: 'card-4',
      text: 'Build comment widget with recursive rendering',
      createdBy: 'Vishal',
      createdAt: NOW - 5 * HOUR,
      updatedAt: NOW - 2 * HOUR,
      isDeleted: null
    },
    'card-5': {
      id: 'card-5',
      text: 'Setup normalized state architecture in TypeScript',
      createdBy: 'Vishal',
      createdAt: NOW - 3 * HOUR,
      updatedAt: NOW - 2 * HOUR,
      isDeleted: null
    },
    'card-6': {
      id: 'card-6',
      text: 'Scaffold project with Vite & TypeScript',
      createdBy: 'Dev Bot',
      createdAt: NOW - 24 * HOUR,
      updatedAt: NOW - 24 * HOUR,
      isDeleted: null
    },
    'card-7': {
      id: 'card-7',
      text: 'Configure ESLint and strict tsconfig settings',
      createdBy: 'Dev Bot',
      createdAt: NOW - 20 * HOUR,
      updatedAt: NOW - 20 * HOUR,
      isDeleted: null
    }
  },

  columns: {
    'col-todo': {
      id: 'col-todo',
      title: 'To Do',
      cards: ['card-1', 'card-2', 'card-3']
    },
    'col-in-progress': {
      id: 'col-in-progress',
      title: 'In Progress',
      cards: ['card-4', 'card-5']
    },
    'col-done': {
      id: 'col-done',
      title: 'Done',
      cards: ['card-6', 'card-7']
    }
  },

  columnOrder: ['col-todo', 'col-in-progress', 'col-done']
};
