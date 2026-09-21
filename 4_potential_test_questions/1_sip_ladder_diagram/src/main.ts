import './style.css';
import type { SipMessage } from './types';
import { MOCK_CALL } from './mock-data';

// Application State: tracks active selected message and participant filter
let selectedMessage: SipMessage | null = MOCK_CALL.messages[0];
let activeActorFilter: string = 'all';

const app = document.querySelector<HTMLDivElement>('#app')!;

/**
 * WHY: Telephony status codes indicate call progression:
 *      - 2xx (200 OK) = Success/Answered (Green)
 *      - 1xx (100 Trying, 180 Ringing) = Provisional progress (Cyan)
 *      - Requests (INVITE, BYE, ACK) = Action triggers (Purple)
 */
function getBadgeClass(msg: SipMessage): string {
  if (msg.statusCode) {
    return msg.statusCode === 200 ? 'badge-2xx' : 'badge-1xx';
  }
  return 'badge-req';
}

/**
 * Builds the initial 2-pane layout:
 * - Left: Diagram container with participant column headers & message ladder
 * - Right: Detail inspector pane for SIP headers & SDP
 */
function initUI() {
  app.innerHTML = `
    <header class="top-bar">
      <div class="title">
        <span>LiveKit</span> SIP Ladder Diagram
      </div>
      <div class="controls">
        <label for="filter-actor">Filter Actor:</label>
        <select id="filter-actor">
          <option value="all">All Participants</option>
          ${MOCK_CALL.participants.map((p) => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </div>
    </header>

    <div class="main-layout">
      <!-- Diagram Column -->
      <div class="diagram-container">
        <div class="actors-header">
          ${MOCK_CALL.participants
            .map((name) => `<div class="actor-col">${name}</div>`)
            .join('')}
        </div>
        <div class="ladder-body" id="ladder-body"></div>
      </div>

      <!-- Detail Inspector Side Pane -->
      <aside class="inspector-pane" id="inspector-pane"></aside>
    </div>
  `;

  // HOW: Filter messages when user selects a specific actor (Caller, Gateway, Carrier)
  const filterSelect = document.querySelector<HTMLSelectElement>('#filter-actor')!;
  filterSelect.addEventListener('change', (e) => {
    activeActorFilter = (e.target as HTMLSelectElement).value;
    renderLadder();
  });

  renderLadder();
  renderInspector();
}

/**
 * Renders the ladder diagram:
 * - HOW: Divides container width equally among participants: colWidth = width / N
 * - Lifeline X coordinate is column center: (index + 0.5) * colWidth
 * - Draws SVG <line> from x1 (sender) to x2 (receiver) with directional arrowhead
 */
function renderLadder() {
  const ladderBody = document.querySelector<HTMLDivElement>('#ladder-body')!;
  ladderBody.innerHTML = '';

  const participants = MOCK_CALL.participants;
  const filteredMessages = MOCK_CALL.messages.filter((msg) => {
    if (activeActorFilter === 'all') return true;
    return msg.from === activeActorFilter || msg.to === activeActorFilter;
  });

  // HOW: Dynamically measure track width so arrows align with column headers
  const trackWidth = ladderBody.clientWidth || 600;
  const colWidth = trackWidth / participants.length;

  filteredMessages.forEach((msg) => {
    const fromIndex = participants.indexOf(msg.from);
    const toIndex = participants.indexOf(msg.to);

    // HOW: Lifelines are centered within each column box
    const x1 = (fromIndex + 0.5) * colWidth;
    const x2 = (toIndex + 0.5) * colWidth;
    const isLeftToRight = x1 < x2;
    const isSelected = selectedMessage?.id === msg.id;

    const row = document.createElement('div');
    row.className = `message-row ${isSelected ? 'selected' : ''}`;

    // HOW: SVG marker defines the arrow tip pointing left or right
    const markerId = `arrow-${msg.id}`;
    const svg = `
      <svg class="arrow-svg" width="${trackWidth}" height="48">
        <defs>
          <marker id="${markerId}" markerWidth="6" markerHeight="6" refX="${isLeftToRight ? 5 : 1}" refY="3" orient="auto">
            <path d="${isLeftToRight ? 'M 0 0 L 6 3 L 0 6 z' : 'M 6 0 L 0 3 L 6 6 z'}" fill="#64748b" />
          </marker>
        </defs>
        <line 
          x1="${x1}" 
          y1="24" 
          x2="${isLeftToRight ? x2 - 5 : x2 + 5}" 
          y2="24" 
          class="arrow-line" 
          marker-end="url(#${markerId})"
        />
      </svg>
    `;

    // WHY: In VoIP debugging, relative offset (+0.35s) highlights packet delay
    const timeSec = `+${(msg.timestamp / 1000).toFixed(2)}s`;

    // HOW: Method badge is centered exactly halfway between sender and receiver
    const midX = (x1 + x2) / 2;

    row.innerHTML = `
      <div class="time-label">${timeSec}</div>
      <div class="arrow-track">
        ${svg}
        <div class="method-badge ${getBadgeClass(msg)}" style="left: ${midX}px;">
          ${msg.method}
        </div>
      </div>
    `;

    // HOW: Click selection highlights row and updates inspection side pane
    row.addEventListener('click', () => {
      selectedMessage = msg;
      renderLadder();
      renderInspector();
    });

    ladderBody.appendChild(row);
  });
}

/**
 * Renders the inspection pane for the selected packet:
 * - WHY: SIP headers (Call-ID, CSeq, Via) diagnose routing bugs
 * - WHY: SDP (Session Description Protocol) reveals audio codec, IP, and media port negotiation
 */
function renderInspector() {
  const pane = document.querySelector<HTMLElement>('#inspector-pane')!;
  if (!selectedMessage) {
    pane.innerHTML = `<p style="color: var(--muted)">Click any message arrow to inspect SIP details.</p>`;
    return;
  }

  const msg = selectedMessage;
  const headerRows = Object.entries(msg.headers)
    .map(([k, v]) => `<tr><td class="hdr-key">${k}:</td><td>${v}</td></tr>`)
    .join('');

  pane.innerHTML = `
    <div class="inspector-title">
      ${msg.method} (${msg.from} ➔ ${msg.to})
    </div>
    <div style="font-size: 12px; color: var(--muted); font-family: monospace;">
      Timestamp: +${(msg.timestamp / 1000).toFixed(2)}s
    </div>

    <div>
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">SIP Headers</div>
      <table class="headers-table">
        <tbody>${headerRows}</tbody>
      </table>
    </div>

    ${
      msg.sdp
        ? `
      <div>
        <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">SDP (Audio Negotiation)</div>
        <div class="sdp-box">${msg.sdp}</div>
      </div>
    `
        : ''
    }
  `;
}

// HOW: Re-calculate X coordinates on resize to keep SVG lines aligned with columns
window.addEventListener('resize', () => {
  renderLadder();
});

// Start app
initUI();
