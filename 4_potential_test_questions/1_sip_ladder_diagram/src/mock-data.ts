import type { CallData } from './types';

export const MOCK_CALL: CallData = {
  callId: 'call-lk-89a1f4b',
  participants: ['WebRTC Client', 'LiveKit Gateway', 'Carrier Trunk'],
  messages: [
    {
      id: 'm1',
      timestamp: 0,
      from: 'WebRTC Client',
      to: 'LiveKit Gateway',
      method: 'INVITE',
      headers: {
        'From': '<sip:+14155550199@livekit.cloud>',
        'To': '<sip:+12025550143@livekit.cloud>',
        'Call-ID': 'call-lk-89a1f4b',
        'User-Agent': 'LiveKit-WebRTC-SDK',
      },
      sdp: 'v=0\no=Client 12345 1 IN IP4 1.2.3.4\nm=audio 5004 RTP/AVP 111\na=rtpmap:111 opus/48000/2',
    },
    {
      id: 'm2',
      timestamp: 35,
      from: 'LiveKit Gateway',
      to: 'WebRTC Client',
      method: '100 Trying',
      statusCode: 100,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
        'Server': 'LiveKit-SIP-Gateway/2.1',
      },
    },
    {
      id: 'm3',
      timestamp: 50,
      from: 'LiveKit Gateway',
      to: 'Carrier Trunk',
      method: 'INVITE',
      headers: {
        'From': '<sip:+14155550199@telnyx.com>',
        'To': '<sip:+12025550143@telnyx.com>',
        'Call-ID': 'call-lk-89a1f4b',
      },
      sdp: 'v=0\no=LiveKit 12345 1 IN IP4 198.51.100.1\nm=audio 5004 RTP/AVP 111\na=rtpmap:111 opus/48000/2',
    },
    {
      id: 'm4',
      timestamp: 320,
      from: 'Carrier Trunk',
      to: 'LiveKit Gateway',
      method: '180 Ringing',
      statusCode: 180,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
    {
      id: 'm5',
      timestamp: 335,
      from: 'LiveKit Gateway',
      to: 'WebRTC Client',
      method: '180 Ringing',
      statusCode: 180,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
    {
      id: 'm6',
      timestamp: 1650,
      from: 'Carrier Trunk',
      to: 'LiveKit Gateway',
      method: '200 OK',
      statusCode: 200,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
        'Contact': '<sip:endpoint@carrier.com:5060>',
      },
      sdp: 'v=0\no=Carrier 98765 1 IN IP4 203.0.113.50\nm=audio 16402 RTP/AVP 111\na=rtpmap:111 opus/48000/2',
    },
    {
      id: 'm7',
      timestamp: 1665,
      from: 'LiveKit Gateway',
      to: 'WebRTC Client',
      method: '200 OK',
      statusCode: 200,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
    {
      id: 'm8',
      timestamp: 1690,
      from: 'WebRTC Client',
      to: 'LiveKit Gateway',
      method: 'ACK',
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
    {
      id: 'm9',
      timestamp: 12450,
      from: 'WebRTC Client',
      to: 'LiveKit Gateway',
      method: 'BYE',
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
        'Reason': 'Q.850;cause=16;text="Normal Clearing"',
      },
    },
    {
      id: 'm10',
      timestamp: 12470,
      from: 'LiveKit Gateway',
      to: 'Carrier Trunk',
      method: 'BYE',
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
    {
      id: 'm11',
      timestamp: 12510,
      from: 'Carrier Trunk',
      to: 'LiveKit Gateway',
      method: '200 OK',
      statusCode: 200,
      headers: {
        'Call-ID': 'call-lk-89a1f4b',
      },
    },
  ],
};
