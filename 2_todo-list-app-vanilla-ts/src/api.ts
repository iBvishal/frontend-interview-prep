import type { BoardState, Card } from './types.js';

const BASE_URL = 'https://api.my-kanban.com/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const api = {
    getBoard: (): Promise<BoardState> => {
        return request<BoardState>('/board');
    },
    createCard: (columnId: string, text: string): Promise<Card> => {
        return request<Card>(`/columns/${columnId}/cards`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    },
    moveCard: (cardId: string, sourceColId: string, targetColId: string): Promise<void> => {
        return request<void>(`/cards/${cardId}/move`, {
            method: 'PUT',
            body: JSON.stringify({ sourceColId, targetColId }),
        });
    },
    deleteCard: (cardId: string): Promise<void> => {
        return request<void>(`/cards/${cardId}`, {
            method: 'DELETE',
        });
    },
};
