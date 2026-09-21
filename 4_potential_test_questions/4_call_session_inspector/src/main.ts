import './style.css';
import type { CallEvent, EventCategory, CallState } from './types';
import { INITIAL_CALL_SESSION } from './mock-data';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Application State
let session = { ...INITIAL_CALL_SESSION, events: [...INITIAL_CALL_SESSION.events] };
let activeCategory: EventCategory | 'ALL' = 'ALL';
let searchQuery = '';
// HOW: Set tracks expanded event cards for O(1) toggles
const expandedEventIds = new Set<string>();

const STATES: CallState[] = ['DIALING', 'RINGING', 'CONNECTED', 'ENDED'];

/**
 * Main render loop: renders session header, stepper, filter toolbar, and event stream
 */
function render() {
  // HOW: Filter events by category and text search inside both title and JSON payload
  const filteredEvents = session.events.filter((ev) => {
    if (activeCategory !== 'ALL' && ev.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchDetails = JSON.stringify(ev.details).toLowerCase().includes(q);
      if (!matchTitle && !matchDetails) return false;
    }
    return true;
  });

  app.innerHTML = `
    <!-- Top Session Header & State Progression -->
    <div class="session-bar">
      <div>
        <div style="font-size: 11px; color: #94a3b8;">CALL SESSION</div>
        <div style="font-family: monospace; font-size: 14px; font-weight: 700; color: #38bdf8;">
          ${session.from} ➔ ${session.to}
        </div>
      </div>

      <!-- WHY: Visual stepper shows call lifecycle state at a glance -->
      <div class="state-stepper">
        ${STATES.map(
          (st) => `<div class="step ${st === session.state ? 'active' : ''}">${st}</div>`
        ).join('')}
      </div>
    </div>

    <!-- Filter & Real-Time Action Toolbar -->
    <div class="toolbar">
      <div style="display: flex; gap: 10px;">
        <select id="cat-filter">
          <option value="ALL" ${activeCategory === 'ALL' ? 'selected' : ''}>All Categories (${session.events.length})</option>
          <option value="SIP" ${activeCategory === 'SIP' ? 'selected' : ''}>SIP Signaling</option>
          <option value="MEDIA" ${activeCategory === 'MEDIA' ? 'selected' : ''}>Media / Audio / DTMF</option>
          <option value="PARTICIPANT" ${activeCategory === 'PARTICIPANT' ? 'selected' : ''}>Participant</option>
          <option value="ERROR" ${activeCategory === 'ERROR' ? 'selected' : ''}>Errors / Warnings</option>
        </select>

        <input 
          type="text" 
          id="search-input" 
          placeholder="Search event payload..." 
          value="${searchQuery}" 
        />
      </div>

      <!-- Actions to demonstrate live stream updates in interview -->
      <div style="display: flex; gap: 8px;">
        <button id="btn-simulate" class="btn">+ Simulate Live Event</button>
        <button id="btn-hangup" class="btn" style="background: #e11d48;">Hang Up (End Call)</button>
      </div>
    </div>

    <!-- Event Timeline List -->
    <div class="event-list" id="event-list">
      ${
        filteredEvents.length === 0
          ? `<div style="text-align: center; color: #94a3b8; padding: 40px;">No events match filter.</div>`
          : filteredEvents
              .map((ev) => {
                const isExpanded = expandedEventIds.has(ev.id);
                return `
              <div class="event-card" data-id="${ev.id}">
                <div class="event-header">
                  <div class="event-title">
                    <span class="badge badge-${ev.category}">${ev.category}</span>
                    <span>${ev.title}</span>
                  </div>
                  <span style="font-family: monospace; font-size: 11px; color: #94a3b8;">
                    +${ev.timestampSec.toFixed(1)}s
                  </span>
                </div>
                <!-- WHY: Expanding shows raw JSON parameters (codecs, DTMF tones, error codes) -->
                ${
                  isExpanded
                    ? `<div class="event-details">${JSON.stringify(ev.details, null, 2)}</div>`
                    : ''
                }
              </div>
            `;
              })
              .join('')
      }
    </div>
  `;

  // Attach event filter listener
  document.querySelector<HTMLSelectElement>('#cat-filter')!.addEventListener('change', (e) => {
    activeCategory = (e.target as HTMLSelectElement).value as EventCategory | 'ALL';
    render();
  });

  // Attach payload search listener
  const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    render();
    const newEl = document.querySelector<HTMLInputElement>('#search-input')!;
    newEl.focus();
    newEl.setSelectionRange(newEl.value.length, newEl.value.length);
  });

  // HOW: Toggle expansion of JSON payload on card click
  document.querySelectorAll<HTMLDivElement>('.event-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id!;
      if (expandedEventIds.has(id)) {
        expandedEventIds.delete(id);
      } else {
        expandedEventIds.add(id);
      }
      render();
    });
  });

  // HOW: Appends a simulated real-time event and auto-scrolls down to bottom of container
  document.querySelector('#btn-simulate')?.addEventListener('click', () => {
    const lastTimestamp = session.events[session.events.length - 1]?.timestampSec || 0;
    const newEvent: CallEvent = {
      id: `ev-${Date.now()}`,
      timestampSec: Number((lastTimestamp + 1.2).toFixed(1)),
      category: 'MEDIA',
      level: 'info',
      title: 'Audio Packet Loss Spike (4.2%)',
      details: { reportedBy: 'WebRTC Ingress', packetsLost: 14, audioJitterMs: 32 },
    };
    session.events.push(newEvent);
    render();

    // WHY: In live log monitoring, auto-scrolling to latest event provides immediate feedback
    const list = document.querySelector('#event-list');
    list?.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  });

  // HOW: Hangup transitions call state machine to 'ENDED' and logs SIP BYE
  document.querySelector('#btn-hangup')?.addEventListener('click', () => {
    session.state = 'ENDED';
    const lastTimestamp = session.events[session.events.length - 1]?.timestampSec || 0;
    session.events.push({
      id: `ev-${Date.now()}`,
      timestampSec: Number((lastTimestamp + 0.5).toFixed(1)),
      category: 'SIP',
      level: 'info',
      title: 'SIP BYE / Call Terminated',
      details: { reason: 'NORMAL_CLEARING', durationSec: lastTimestamp + 0.5 },
    });
    render();
  });
}

render();
