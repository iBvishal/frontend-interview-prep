import type { BoardState, Card, Column } from './types.js';

export function formatTimeAgo(timestamp: number): string {
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
    if (secondsAgo < 60) return 'just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo}d ago`;
}

function renderCard(card: Card, columnId: string, boardState: BoardState): string {
    const colIndex = boardState.columnOrder.indexOf(columnId);
    const isFirstCol = colIndex <= 0;
    const isLastCol = colIndex === boardState.columnOrder.length - 1;

    const moveLeftBtn = !isFirstCol
        ? `<button class="move-card-left-btn" data-card-id="${card.id}" data-column-id="${columnId}">←</button>`
        : '';
    const moveRightBtn = !isLastCol
        ? `<button class="move-card-right-btn" data-card-id="${card.id}" data-column-id="${columnId}">→</button>`
        : '';

    return `
    <div class="card" data-card-id="${card.id}" data-column-id="${columnId}">
        <div class="card-text">${card.text}</div>
        <div class="card-meta">
            <span>${card.createdBy}</span>
            <span>${formatTimeAgo(card.createdAt)}</span>
        </div>
        <div class="card-actions">
            ${moveLeftBtn}
            ${moveRightBtn}
            <button class="edit-card-btn" data-card-id="${card.id}">Edit</button>
            <button class="delete-card-btn" data-card-id="${card.id}" data-column-id="${columnId}">Delete</button>
        </div>
    </div>
    `;
}

function renderColumn(column: Column, boardState: BoardState): string {
    // Look up card objects from boardState.cards dictionary using the IDs in column.cards
    const cardsHtml = column.cards
        .map((cardId) => {
            const card = boardState.cards[cardId];
            return card ? renderCard(card, column.id, boardState) : '';
        })
        .join('');

    return `
    <div class="column" data-column-id="${column.id}">
        <div class="column-title">
            <span>${column.title}</span>
            <span class="card-count-badge">${column.cards.length}</span>
        </div>
        <div class="column-cards">
            ${cardsHtml}
        </div>
        <div class="add-card-container">
            <input class="add-card-input" type="text" placeholder="+ Add a card..." data-column-id="${column.id}" />
            <button class="add-card-btn" data-column-id="${column.id}">Add Card</button>
        </div>  
    </div>
    `;
}

export function renderBoardState(state: BoardState): string {
    return `
    <div class="board">
        ${state.columnOrder.map((colId) => renderColumn(state.columns[colId], state)).join('')}
        
        <!-- Add New Column Form -->
        <div class="add-column-box">
            <div class="column-title">
                <input class="add-column-input" type="text" placeholder="New Column Title..." />
            </div>
            <button class="add-column-btn">Add Column</button>
        </div>
    </div>
    `;
}
