export interface SipMessage {
  id: string;
  timestamp: number; // ms offset from call start
  from: string;
  to: string;
  method: string; // e.g. 'INVITE', '180 Ringing', '200 OK', 'BYE', '486 Busy Here'
  statusCode?: number;
  headers: Record<string, string>;
  sdp?: string;
}

export interface CallData {
  callId: string;
  participants: string[];
  messages: SipMessage[];
}
