# Problem 2: RTP Stream Quality & Metrics Graph

## Background
Telephony audio packets travel over RTP (Real-time Transport Protocol). In LiveKit's telephony stack, audio quality issues (choppiness, robotic voice, lag) are caused by packet loss, jitter (inter-arrival packet delay variance), or excessive round-trip time (RTT).

## The Task
Build a lightweight time-series telemetry widget in Vanilla TypeScript that visualizes media stream metrics over the duration of a call.

## Functional Requirements
1. **Metrics Visualization (Canvas or SVG):**
   - Render two synchronous line plots across time:
     - **Packet Loss (%)** (e.g. 0% - 15%)
     - **Jitter (ms)** (e.g. 0ms - 80ms)
   - Support rendering audio level or bitrate if toggled.
2. **Quality Degradation Highlights:**
   - Shaded alert regions where call quality degraded (e.g., packet loss > 5% or jitter > 30ms shaded in soft amber/red).
3. **Interactive Scrubber & Tooltip:**
   - Moving the cursor across the timeline shows a vertical crosshair and a floating tooltip displaying:
     - Exact call duration timestamp (`MM:SS`)
     - Packet loss %
     - Jitter (ms)
     - RTT (ms)
4. **Summary Metric Badges:**
   - Top bar showing aggregate metrics: `Avg Packet Loss`, `Max Jitter`, `Total Audio Duration`, `MOS Score (Mean Opinion Score: 1.0 - 5.0)`.

## Mock Data Shape
```typescript
export interface RtpMetricPoint {
  timestamp: number; // ms from start
  packetsSent: number;
  packetsLost: number;
  jitterMs: number;
  rttMs: number;
  audioLevel: number; // 0.0 - 1.0
}
```
