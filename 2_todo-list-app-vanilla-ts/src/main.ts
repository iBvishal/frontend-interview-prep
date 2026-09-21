import './style.css'
import type { BoardState } from './types.ts'
import { renderBoardState } from './renderBoard.ts'
import { initialBoardState } from './mockData.ts'
import { saveState, loadState } from './localStorage.ts'

const state: BoardState = loadState() || initialBoardState;
const app = document.querySelector<HTMLElement>('#app')

function handleShift(cardId: string, columnId: string, direction: 'left' | 'right') {
  if (!cardId) return;
  const colIndex = state.columnOrder.indexOf(columnId)

  let targetColumnId: string;

  if (direction === "left") {
    targetColumnId = state.columnOrder[colIndex - 1];
  } else {
    targetColumnId = state.columnOrder[colIndex + 1];
  }

  // remove the card from current column and add it to target column
  const currentColumn = state.columns[columnId];
  currentColumn.cards = currentColumn.cards.filter(id => id !== cardId);

  const targetColumn = state.columns[targetColumnId];
  targetColumn.cards.push(cardId);
}

app?.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  if (target.classList.contains('move-card-left-btn')) {
    handleShift(target.dataset.cardId, target.dataset.columnId, 'left')
  }
  else if (target.classList.contains('move-card-right-btn')) {
    handleShift(target.dataset.cardId, target.dataset.columnId, 'right')
  }

  saveAndRender();
  return;
})

function saveAndRender() {
  saveState(state);
  if (!app) return;
  app.innerHTML = `${renderBoardState(state)}`
}

saveAndRender();