import './style.css';
import { MOCK_STREAM_STATS } from './mock-data';

const app = document.querySelector<HTMLDivElement>('#app')!;
const stats = MOCK_STREAM_STATS;

// Toggles state: allows isolating individual metrics
let showLoss = true;
let showJitter = true;

/**
 * Initializes dashboard shell with aggregate metrics and the chart canvas
 */
function renderApp() {
  // HOW: Compute summary KPIs from raw telemetry points
  const avgLoss = (stats.points.reduce((acc, p) => acc + p.packetLossPct, 0) / stats.points.length).toFixed(1);
  const maxJitter = Math.max(...stats.points.map((p) => p.jitterMs));
  // WHY: Industry standard: Any packet loss > 5% causes audible degradation
  const isDegraded = stats.points.some((p) => p.packetLossPct > 5);

  app.innerHTML = `
    <header class="top-nav">
      <h1>LiveKit Telephony // RTP Stream Metrics</h1>
      <span style="font-family: monospace; font-size: 13px; color: #94a3b8;">${stats.codec}</span>
    </header>

    <!-- Key Metrics Summary Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Call Duration</div>
        <div class="stat-value">01:00</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Packet Loss</div>
        <div class="stat-value" style="color: #06b6d4;">${avgLoss}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Max Jitter</div>
        <div class="stat-value" style="color: #f59e0b;">${maxJitter}ms</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Overall Quality</div>
        <div class="stat-value ${isDegraded ? 'badge-degraded' : 'badge-good'}">
          ${isDegraded ? 'Degraded' : 'Optimal'}
        </div>
      </div>
    </div>

    <!-- Telemetry Graph Box -->
    <div class="chart-box" id="chart-container">
      <div class="chart-header">
        <div class="chart-title">Audio Stream Quality Over Time</div>
        <div class="toggles">
          <label class="toggle-label" style="color: #06b6d4;">
            <input type="checkbox" id="chk-loss" ${showLoss ? 'checked' : ''} />
            Packet Loss % (Max 15%)
          </label>
          <label class="toggle-label" style="color: #f59e0b;">
            <input type="checkbox" id="chk-jitter" ${showJitter ? 'checked' : ''} />
            Jitter ms (Max 60ms)
          </label>
        </div>
      </div>

      <!-- Interactive SVG Chart Area -->
      <svg class="svg-chart" id="svg-chart"></svg>
      <div class="tooltip" id="chart-tooltip"></div>
    </div>
  `;

  // HOW: Toggle metrics dynamically and redraw SVG polylines
  document.querySelector<HTMLInputElement>('#chk-loss')!.addEventListener('change', (e) => {
    showLoss = (e.target as HTMLInputElement).checked;
    drawChart();
  });
  document.querySelector<HTMLInputElement>('#chk-jitter')!.addEventListener('change', (e) => {
    showJitter = (e.target as HTMLInputElement).checked;
    drawChart();
  });

  drawChart();
}

/**
 * Draws the SVG telemetry chart:
 * - WHY SVG? Zero 3rd party dependencies, crisp vectors, easy coordinate normalization
 * - HOW: Normalizes data domain [0, max] to pixel bounding box [padding, width - padding]
 */
function drawChart() {
  const svg = document.querySelector<SVGSVGElement>('#svg-chart')!;
  const tooltip = document.querySelector<HTMLDivElement>('#chart-tooltip')!;

  const width = svg.clientWidth || 800;
  const height = svg.clientHeight || 320;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Maximum scales for axes
  const maxTime = 60;
  const maxLoss = 15; // 0% to 15%
  const maxJitter = 60; // 0ms to 60ms

  // HOW: Coordinate mapping formulas (Note: SVG Y is inverted, 0 is at top)
  const getX = (t: number) => padding.left + (t / maxTime) * plotW;
  const getYLoss = (pct: number) => padding.top + plotH - (pct / maxLoss) * plotH;
  const getYJitter = (ms: number) => padding.top + plotH - (ms / maxJitter) * plotH;

  // HOW: Convert points array into SVG polyline coordinates string ("x1,y1 x2,y2 ...")
  const lossPoints = stats.points.map((p) => `${getX(p.timeSec)},${getYLoss(p.packetLossPct)}`).join(' ');
  const jitterPoints = stats.points.map((p) => `${getX(p.timeSec)},${getYJitter(p.jitterMs)}`).join(' ');

  // WHY: Visual threshold at 5% packet loss immediately alerts operators to degradation
  const warnY = getYLoss(5);

  svg.innerHTML = `
    <!-- Axes lines -->
    <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" class="axis-line" />
    <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" class="axis-line" />

    <!-- 5% Threshold Warning Line -->
    <line x1="${padding.left}" y1="${warnY}" x2="${width - padding.right}" y2="${warnY}" class="threshold-line" />
    <text x="${width - padding.right - 80}" y="${warnY - 6}" fill="#f43f5e" font-size="10" font-family="monospace">5% Loss Limit</text>

    <!-- Y-Axis Ticks (Loss %) -->
    <text x="${padding.left - 10}" y="${getYLoss(0) + 4}" text-anchor="end" class="axis-text">0%</text>
    <text x="${padding.left - 10}" y="${getYLoss(5) + 4}" text-anchor="end" class="axis-text">5%</text>
    <text x="${padding.left - 10}" y="${getYLoss(10) + 4}" text-anchor="end" class="axis-text">10%</text>
    <text x="${padding.left - 10}" y="${getYLoss(15) + 4}" text-anchor="end" class="axis-text">15%</text>

    <!-- X-Axis Ticks (Time) -->
    <text x="${getX(0)}" y="${height - padding.bottom + 20}" text-anchor="middle" class="axis-text">00:00</text>
    <text x="${getX(20)}" y="${height - padding.bottom + 20}" text-anchor="middle" class="axis-text">00:20</text>
    <text x="${getX(40)}" y="${height - padding.bottom + 20}" text-anchor="middle" class="axis-text">00:40</text>
    <text x="${getX(60)}" y="${height - padding.bottom + 20}" text-anchor="middle" class="axis-text">01:00</text>

    <!-- Data Polylines -->
    ${showLoss ? `<polyline points="${lossPoints}" class="line-loss" />` : ''}
    ${showJitter ? `<polyline points="${jitterPoints}" class="line-jitter" />` : ''}

    <!-- Vertical Crosshair (Updated on mousemove) -->
    <line id="crosshair" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" class="crosshair" style="display: none;" />
  `;

  // HOW: Interactive Hover Scrubber
  const crosshair = svg.querySelector<SVGLineElement>('#crosshair')!;

  svg.onmousemove = (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Constrain to active plot area
    if (mouseX < padding.left || mouseX > width - padding.right) {
      crosshair.style.display = 'none';
      tooltip.style.display = 'none';
      return;
    }

    // HOW: Map cursor X to timeline seconds, then find nearest sample point
    const relX = (mouseX - padding.left) / plotW;
    const hoverTime = relX * maxTime;
    const closest = stats.points.reduce((prev, curr) =>
      Math.abs(curr.timeSec - hoverTime) < Math.abs(prev.timeSec - hoverTime) ? curr : prev
    );

    const ptX = getX(closest.timeSec);
    crosshair.setAttribute('x1', `${ptX}`);
    crosshair.setAttribute('x2', `${ptX}`);
    crosshair.style.display = 'block';

    // HOW: Show floating tooltip next to crosshair with exact metrics
    const timeFormatted = `00:${closest.timeSec.toString().padStart(2, '0')}`;
    tooltip.style.display = 'block';
    tooltip.style.left = `${ptX + 16}px`;
    tooltip.style.top = `${padding.top + 30}px`;
    tooltip.innerHTML = `
      <div style="color: #cbd5e1; font-weight: bold; margin-bottom: 4px;">Time: ${timeFormatted}</div>
      <div style="color: #06b6d4;">Packet Loss: ${closest.packetLossPct}%</div>
      <div style="color: #f59e0b;">Jitter: ${closest.jitterMs}ms</div>
      <div style="color: #94a3b8;">RTT: ${closest.rttMs}ms</div>
    `;
  };

  svg.onmouseleave = () => {
    crosshair.style.display = 'none';
    tooltip.style.display = 'none';
  };
}

// HOW: Redraw on window resize to ensure coordinates recalculate responsively
window.addEventListener('resize', () => drawChart());

renderApp();
