export interface Card {
    id: string;
    text: string;
    createdBy: string;
    createdAt: number; // timestamp
    isDeleted: boolean | null;
    updatedAt: number;
}

export interface Column {
    id: string;
    title: string;
    cards: string[]; // to store card ID's
}

export interface BoardState {
    cards: Record<string, Card>;
    columns: Record<string, Column>;
    columnOrder: string[];
}
