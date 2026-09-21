import './style.css';
import type { SmsAnalysis, SmsEncoding } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Application State
let messageText = 'LiveKit Alert: Your audio conference room is ready! Reply STOP to unsubscribe.';
let recipientCount = 1000;

/**
 * HOW: Checks whether a character falls outside standard 7-bit printable ASCII.
 * WHY: Any non-GSM character (e.g. emojis 🚀, curly quotes “”, accented letters)
 *      forces the carrier modem to downgrade the entire message to UCS-2 encoding.
 */
function isNonGsm(char: string): boolean {
  const code = char.charCodeAt(0);
  // Printable ASCII codes are 32 to 126, plus newline (10) and carriage return (13)
  return !(code === 10 || code === 13 || (code >= 32 && code <= 126));
}

/**
 * Analyzes message length, segment count, character encoding, and compliance.
 * 
 * WHY: Carrier SMS payload limits:
 * - GSM-7:  Single = 160 chars. Multi-part = 153 chars/segment (7 chars used by UDH header).
 * - UCS-2:  Single = 70 chars.  Multi-part = 67 chars/segment (3 chars used by UDH header).
 */
function analyzeSms(text: string, recipients: number): SmsAnalysis {
  // HOW: Use Array.from to correctly preserve multi-byte Unicode/surrogate pairs
  const chars = Array.from(text);
  const nonGsmChars = Array.from(new Set(chars.filter(isNonGsm)));
  const encoding: SmsEncoding = nonGsmChars.length > 0 ? 'UCS-2' : 'GSM-7';

  const singleLimit = encoding === 'GSM-7' ? 160 : 70;
  const multiLimit = encoding === 'GSM-7' ? 153 : 67;

  let segmentCount = 0;
  let remainingInSegment = singleLimit;

  // HOW: Calculate segment count based on single-part vs concatenated multi-part limits
  if (chars.length > 0) {
    if (chars.length <= singleLimit) {
      segmentCount = 1;
      remainingInSegment = singleLimit - chars.length;
    } else {
      segmentCount = Math.ceil(chars.length / multiLimit);
      remainingInSegment = segmentCount * multiLimit - chars.length;
    }
  }

  // WHY: 10DLC regulation: US carriers require explicit opt-out keywords to prevent spam flags
  const hasOptOut = /\b(STOP|UNSUBSCRIBE|CANCEL|QUIT|END)\b/i.test(text);

  // HOW: Standard carrier wholesale rate is ~$0.0079 per segment per recipient
  const estimatedCost = segmentCount * recipients * 0.0079;

  return {
    text,
    charCount: chars.length,
    encoding,
    segmentCount,
    remainingInSegment,
    nonGsmChars,
    hasOptOut,
    estimatedCost,
  };
}

/**
 * Renders the reactive editor, live counters, compliance banners, and cost preview
 */
function render() {
  const analysis = analyzeSms(messageText, recipientCount);

  app.innerHTML = `
    <div class="header">
      <h1>LiveKit Telephony // SMS Segment & Compliance Checker</h1>
    </div>

    <div class="grid-layout">
      <!-- Left: Editor & Live Telemetry Counters -->
      <div class="card">
        <label style="font-size: 13px; font-weight: 600;">Message Content:</label>
        <textarea id="sms-input" placeholder="Type SMS message here...">${messageText}</textarea>

        <!-- Dynamic Segment & Encoding Counters -->
        <div class="meta-counters">
          <div class="counter-box">
            <div class="counter-label">Characters</div>
            <div class="counter-val">${analysis.charCount}</div>
          </div>
          <div class="counter-box">
            <div class="counter-label">Segments</div>
            <div class="counter-val" style="color: #38bdf8;">${analysis.segmentCount}</div>
          </div>
          <div class="counter-box">
            <div class="counter-label">Remaining</div>
            <div class="counter-val">${analysis.remainingInSegment}</div>
          </div>
          <div class="counter-box">
            <div class="counter-label">Encoding</div>
            <div class="counter-val" style="color: ${analysis.encoding === 'UCS-2' ? '#f43f5e' : '#10b981'};">
              ${analysis.encoding}
            </div>
          </div>
        </div>

        <!-- Non-GSM Culprit Characters Alert -->
        ${
          analysis.nonGsmChars.length > 0
            ? `
          <div class="alert-box alert-danger">
            ⚠️ <strong>UCS-2 Downgrade:</strong> Non-GSM characters detected: 
            ${analysis.nonGsmChars.map((c) => `<code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 3px;">${c}</code>`).join(' ')}.
            Segment capacity reduced from 160 to 70 chars!
          </div>
        `
            : ''
        }

        <!-- 10DLC Compliance Check -->
        <div class="alert-box ${analysis.hasOptOut ? 'alert-success' : 'alert-warning'}">
          ${
            analysis.hasOptOut
              ? '✅ <strong>Compliant:</strong> Includes standard opt-out keyword (STOP/UNSUBSCRIBE).'
              : '⚠️ <strong>Carrier Warning:</strong> Missing mandatory opt-out keyword ("Reply STOP to opt out").'
          }
        </div>

        <!-- Quick Demo Presets for Interview Walkthrough -->
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <span style="font-size: 11px; color: #94a3b8; align-self: center;">Test Presets:</span>
          <button id="btn-standard" style="background:#334155; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Standard GSM-7</button>
          <button id="btn-emoji" style="background:#334155; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">With Emoji 🚀 (UCS-2)</button>
          <button id="btn-long" style="background:#334155; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Multi-segment</button>
        </div>
      </div>

      <!-- Right: Cost Calculator & Recipient Device Preview -->
      <div class="card">
        <label style="font-size: 13px; font-weight: 600;">Campaign Cost Calculator:</label>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
          <span>Recipients: <strong id="recipients-label">${recipientCount.toLocaleString()}</strong></span>
          <input type="range" id="recipients-slider" min="100" max="10000" step="100" value="${recipientCount}" style="width: 160px;" />
        </div>

        <div style="background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 6px; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span>Estimated Total Cost ($0.0079 / segment):</span>
          <span style="font-size: 18px; font-weight: 700; color: #10b981; font-family: monospace;">
            $${analysis.estimatedCost.toFixed(2)}
          </span>
        </div>

        <label style="font-size: 13px; font-weight: 600; margin-top: 10px;">Recipient Device Preview:</label>
        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; height: 180px; padding: 16px; display: flex; flex-direction: column; justify-content: flex-end;">
          <div class="phone-bubble">
            ${analysis.text || '<span style="opacity:0.5;">(Empty message)</span>'}
          </div>
        </div>
      </div>
    </div>
  `;

  // HOW: Input listener updates analysis in real-time and preserves caret position
  const input = document.querySelector<HTMLTextAreaElement>('#sms-input')!;
  input.addEventListener('input', (e) => {
    messageText = (e.target as HTMLTextAreaElement).value;
    render();
    const newEl = document.querySelector<HTMLTextAreaElement>('#sms-input')!;
    newEl.focus();
    newEl.setSelectionRange(newEl.value.length, newEl.value.length);
  });

  const slider = document.querySelector<HTMLInputElement>('#recipients-slider')!;
  slider.addEventListener('input', (e) => {
    recipientCount = Number((e.target as HTMLInputElement).value);
    render();
  });

  // Preset handlers to quickly demo scenarios to the interviewer
  document.querySelector('#btn-standard')?.addEventListener('click', () => {
    messageText = 'LiveKit Telephony: Your verification code is 492019. Valid for 10 minutes. Reply STOP to cancel.';
    render();
  });
  document.querySelector('#btn-emoji')?.addEventListener('click', () => {
    messageText = 'LiveKit 🚀 Special Announcement! Your voice bot is ready. Reply STOP to cancel.';
    render();
  });
  document.querySelector('#btn-long')?.addEventListener('click', () => {
    messageText =
      'Important update from LiveKit Telephony: We have expanded our international trunking capabilities to over 40 countries across Europe and Asia. Please review your account settings and update your caller ID configuration to ensure seamless delivery. Reply STOP to opt out.';
    render();
  });
}

render();
