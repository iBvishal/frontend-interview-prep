import type { StreamStats } from './types';

export const MOCK_STREAM_STATS: StreamStats = {
  callId: 'call-rtp-8910',
  codec: 'Opus (48kHz / 2ch)',
  durationSec: 60,
  points: [
    { timeSec: 0, packetLossPct: 0.1, jitterMs: 4, rttMs: 25 },
    { timeSec: 5, packetLossPct: 0.2, jitterMs: 6, rttMs: 28 },
    { timeSec: 10, packetLossPct: 0.0, jitterMs: 5, rttMs: 26 },
    { timeSec: 15, packetLossPct: 0.5, jitterMs: 8, rttMs: 30 },
    { timeSec: 20, packetLossPct: 2.1, jitterMs: 18, rttMs: 55 },
    { timeSec: 25, packetLossPct: 6.8, jitterMs: 42, rttMs: 110 },
    { timeSec: 30, packetLossPct: 9.4, jitterMs: 52, rttMs: 145 },
    { timeSec: 35, packetLossPct: 7.2, jitterMs: 38, rttMs: 95 },
    { timeSec: 40, packetLossPct: 3.1, jitterMs: 20, rttMs: 60 },
    { timeSec: 45, packetLossPct: 1.0, jitterMs: 11, rttMs: 38 },
    { timeSec: 50, packetLossPct: 0.4, jitterMs: 7, rttMs: 29 },
    { timeSec: 55, packetLossPct: 0.2, jitterMs: 5, rttMs: 27 },
    { timeSec: 60, packetLossPct: 0.1, jitterMs: 4, rttMs: 26 },
  ],
};
