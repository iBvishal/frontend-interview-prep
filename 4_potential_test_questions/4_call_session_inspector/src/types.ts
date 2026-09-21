/**
 * Telephony event categories:
 * - 'SIP': Signaling messages (INVITE, Ringing, 200 OK, BYE)
 * - 'MEDIA': Audio tracks, codecs, DTMF keypad button presses
 * - 'PARTICIPANT': WebRTC / PSTN actors joining or leaving the audio room
 * - 'ERROR': Network degradation, packet loss alerts, or dropped legs
 */
export type EventCategory = 'SIP' | 'MEDIA' | 'PARTICIPANT' | 'ERROR';

/**
 * Standard telephony call state machine transitions:
 * DIALING (outbound INVITE) -> RINGING (180 response) -> CONNECTED (audio flowing) -> ENDED (BYE)
 */
export type CallState = 'DIALING' | 'RINGING' | 'CONNECTED' | 'ENDED';

/**
 * An individual telephony telemetry event in the call session log.
 */
export interface CallEvent {
  id: string;
  timestampSec: number; // relative seconds from call start (+1.4s)
  category: EventCategory;
  level: 'info' | 'warn' | 'error';
  title: string;
  details: Record<string, unknown>; // arbitrary JSON payload for expandable drawer
}

/**
 * High-level telephone session model.
 */
export interface CallSession {
  callId: string;
  from: string; // caller number/ID
  to: string; // destination number
  state: CallState;
  events: CallEvent[];
}
