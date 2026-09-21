# Problem 1: Interactive SIP Ladder Diagram (Call Flow Sequence)

## Background
In telephony at LiveKit, when debugging VoIP and PSTN calls, engineers rely heavily on **SIP Ladder Diagrams** (sequence flow diagrams). These visualize the signaling handshake and teardown between call participants (e.g., Caller / WebRTC Client, LiveKit SIP Gateway, Carrier Trunk / Telnyx / Twilio).

## The Task
Build an interactive SIP sequence diagram component in Vanilla TypeScript that renders a chronological sequence of messages between lifelines.

## Functional Requirements
1. **Dynamic Participants Lifelines:**
   - Render vertical dashed or solid lifelines for each participant present in the dataset (e.g., `Client`, `LiveKit SIP Server`, `Carrier PSTN`).
   - Actor headers at the top should clearly distinguish roles with clean badges.
2. **Directed Message Arrows:**
   - For each message, draw an arrow from the `from` lifeline to the `to` lifeline.
   - Include the method name / status code (e.g. `INVITE`, `100 Trying`, `180 Ringing`, `200 OK`, `ACK`, `BYE`, `486 Busy`).
   - Display the relative timestamp (e.g. `+0.00s`, `+0.12s`, etc.).
   - Style status codes semantically: provisional (`1xx` = blue/purple), success (`2xx` = green), client error (`4xx` = red/orange).
3. **Interactive Inspection Panel (Drawer or Modal):**
   - Clicking on any message line or label opens a detail drawer showing:
     - Full SIP Headers (`Call-ID`, `CSeq`, `From`, `To`, `User-Agent`, `Content-Type`).
     - SDP body (Session Description Protocol) in a syntax/monospaced block.
     - Latency / Delta time since the previous message.
4. **Filtering & Search:**
   - Filter by participant (show only messages involving `Client`).
   - Filter by status/type (toggle error messages or handshake only).
5. **Aesthetics & Polish:**
   - Clean dark-mode developer UI (like LiveKit Cloud dashboard).
   - SVG or Canvas for smooth, crisp arrow lines with arrowheads (`marker-end`).

## Mock Data Shape
```typescript
export interface SipMessage {
  id: string;
  timestamp: number; // ms offset
  from: string;
  to: string;
  method: string;
  statusCode?: number;
  statusText?: string;
  headers: Record<string, string>;
  sdp?: string;
}
```
