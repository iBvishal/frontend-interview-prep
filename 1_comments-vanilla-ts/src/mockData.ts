import type { CommentState } from './types';

const NOW = Date.now();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const initialCommentState: CommentState = {
  byId: {
    // Thread 1: Has branching replies (c1 has two direct children: c2 and c3)
    'c1': {
      id: 'c1',
      author: 'Sarah Chen',
      text: 'What do you think of this normalized state architecture for machine coding?',
      createdAt: NOW - 3 * HOUR,
      votes: 18,
      parentId: null,
      replyIds: ['c2', 'c3']
    },
    'c2': {
      id: 'c2',
      author: 'Marcus Vance',
      text: 'It is amazing because lookups are O(1) instead of expensive recursive DFS traversals.',
      createdAt: NOW - 2 * HOUR,
      votes: 9,
      parentId: 'c1',
      replyIds: ['c4']
    },
    'c3': {
      id: 'c3',
      author: 'Priya Patel',
      text: 'Agreed! And it prevents accidental mutation of deep objects when updating state.',
      createdAt: NOW - 100 * MINUTE,
      votes: 5,
      parentId: 'c1',
      replyIds: []
    },
    // Deep nested reply under c2
    'c4': {
      id: 'c4',
      author: 'Sarah Chen',
      text: 'Exactly Marcus. Even if a comment is 10 levels deep, state.byId[id].votes++ takes constant time!',
      createdAt: NOW - 50 * MINUTE,
      votes: 7,
      parentId: 'c2',
      replyIds: []
    },

    // Thread 2: Tests soft-deleted comment with active replies (Reddit style)
    'c5': {
      id: 'c5',
      author: 'Alex Rivera',
      text: 'This was an outdated question that was deleted by the user.',
      createdAt: NOW - 90 * MINUTE,
      votes: 2,
      parentId: null,
      replyIds: ['c6']
    },
    'c6': {
      id: 'c6',
      author: 'Elena Rostova',
      text: 'Even though the parent above was deleted, this reply should still be readable!',
      createdAt: NOW - 40 * MINUTE,
      votes: 6,
      parentId: 'c5',
      replyIds: []
    },

    // Thread 3: Single top-level comment (0 replies)
    'c7': {
      id: 'c7',
      author: 'Liam Johnson',
      text: 'Always remember to sanitize comment inputs with lodash.escape or DOM textContent to prevent XSS attacks.',
      createdAt: NOW - 25 * MINUTE,
      votes: 14,
      parentId: null,
      replyIds: []
    },

    // Thread 4: Recent short discussion
    'c8': {
      id: 'c8',
      author: 'Zoe Kim',
      text: 'Adding visual thread lines (vertical borders) makes deep nesting look super clean.',
      createdAt: NOW - 10 * MINUTE,
      votes: 4,
      parentId: null,
      replyIds: ['c9']
    },
    'c9': {
      id: 'c9',
      author: 'Dev Bot',
      text: 'Agreed. A simple 2px border on the left container does wonders for readability.',
      createdAt: NOW - 2 * MINUTE,
      votes: 1,
      parentId: 'c8',
      replyIds: []
    }
  },

  // The 4 top-level discussion roots in order
  rootIds: ['c1', 'c5', 'c7', 'c8']
};
