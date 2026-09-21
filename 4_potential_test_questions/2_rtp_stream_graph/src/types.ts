/**
 * Single time-series sample of RTP (Real-time Transport Protocol) audio telemetry.
 * 
 * WHY: Audio quality issues (choppy voice, robot sound, lag) stem from three metrics:
 * - packetLossPct: Missing audio frames (losses > 5% cause noticeable artifacts)
 * - jitterMs: Variation in packet arrival time (high jitter causes audio buffer underruns)
 * - rttMs: Round-Trip Time latency (RTT > 250ms causes awkward conversational delays)
 */
export interface MetricPoint {
  timeSec: number; // seconds from call start (e.g. 0, 5, 10, ... 60)
  packetLossPct: number; // percentage of lost RTP packets (0% to 15%)
  jitterMs: number; // packet arrival delay variance in ms (0ms to 60ms)
  rttMs: number; // round-trip network ping in ms
}

/**
 * Call media stream metadata and time-series telemetry series.
 */
export interface StreamStats {
  callId: string;
  codec: string; // e.g. Opus (48kHz stereo) - primary WebRTC audio codec
  durationSec: number;
  points: MetricPoint[];
}
