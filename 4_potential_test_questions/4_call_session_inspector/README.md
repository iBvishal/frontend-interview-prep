# Problem 4: Live Telephony Call Session Inspector

## Background
Telephony calls in LiveKit progress through states: `Dialing -> Ringing -> Answered (Audio Connected) -> Hold/Transfer -> Disconnected (Hangup/Error)`. Telephony teams need a unified inspector combining state transitions, SIP signals, WebRTC tracks, and audio DTMF tones.

## The Task
Build a live call debugger and inspector that displays call lifecycle status, participant state, audio wave/activity, and an interactive searchable event log.

## Functional Requirements
1. **Call Overview Header:**
   - Call ID, Caller/Callee numbers, Duration timer (`00:02:14`).
   - Call State Badge (`ringing`, `connected`, `completed`, `failed`).
   - Termination cause (e.g., `NORMAL_CLEARING`, `USER_BUSY`, `NO_ANSWER`).
2. **Event Timeline & Filter:**
   - Filter events by type (`SIP`, `Audio/DTMF`, `Participant`, `Error`).
   - Text search across event payload.
   - Expandable JSON tree / formatted inspection for each event.
3. **Simulated Real-Time Mode:**
   - "Play Call" button that replays call events in real-time or fast-forward (2x, 5x).
   - Dynamic auto-scroll to the latest event with manual override when scrolling up.
