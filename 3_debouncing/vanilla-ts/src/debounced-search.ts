import { fetchUtil } from "./api";

export function renderDebouncedSearch() {
    return `
  <div class="search">
      <input type="text" id="searchInputBox">
  </div>
  `
}

// debouncing using closure
// cancel and flish, if someone does the excape or press enter to search immediately
// abort controller to about any ongoing request
function debounceUtil(cb: Function, delay: number) {
    let timerId: number;
    return function (this: any, ...args: any[]) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            cb.apply(this, args);
        }, delay);
    }
}

const debouncedFetch = debounceUtil(async (value: string) => {
    const data = await fetchUtil('posts', value);
    console.log(data)
}, 500)

// making the request
const getData = function (event: Event) {
    const value = (event.target as HTMLInputElement).value.trim()
    if (!value) return;

    debouncedFetch(value)
}

export function initDebouncedSearch() {
    const searchInput = document.querySelector<HTMLInputElement>('#searchInputBox');
    searchInput?.addEventListener('input', getData);

    return () => {
        searchInput?.removeEventListener('input', getData);
    }
}
