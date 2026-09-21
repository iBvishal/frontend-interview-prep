import './style.css'
import { renderDebouncedSearch, initDebouncedSearch } from './debounced-search'

const app = document.querySelector<HTMLElement>('#app')
let cleanupSearch: (() => void) | undefined;

function render() {
  if (!app) return

  app.innerHTML = renderDebouncedSearch()
  cleanupSearch = initDebouncedSearch();
}

render()
