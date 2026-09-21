// debounce using closure
function debounceUtil(cb, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            cb.apply(this, args);
        }, delay);
    }
}

// calling the debounce function
const getData = debounceUtil(fetchUtil, 500);

// actual function to be called after the debounce delay    
function fetchUtil(e) {
    const val = e.target.value.trim();
    if (!val) return;
    console.log('Searching ...' + val);
}
