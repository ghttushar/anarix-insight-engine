I’ll fix the scatter chart to match the attached design and make it usable.

Implementation plan:

1. Tooltip/card usability
- Keep the tooltip open when moving from a cluster/dot to the card.
- Add a short hover-close delay instead of closing immediately on `mouseLeave`.
- Let the tooltip itself cancel the close timer on hover.
- Keep `View details` functional from the tooltip and single-dot clicks.

2. Axis/tick cleanup
- Replace the dynamic tick generator with explicit, bounded ticks for this chart:
  - X axis: `-30, 0, 30, 60, 90, 100` or clean zoom-derived ticks with a minimum pixel gap.
  - Y axis: `0, 15, 30, 45, 60, 75, 90` or clean zoom-derived ticks with a minimum pixel gap.
- Deduplicate rounded tick labels so the same number cannot render repeatedly.
- Increase left/top chart padding so Y labels never overlap the axis label.
- Clamp axis domains so zoom/pan cannot create unreadable axis values.

3. Mouse pointer visibility
- Remove the crosshair cursor and use the normal pointer/default cursor for the chart area.
- Use `grab` / `grabbing` only for panning.
- Use `pointer` only on clickable cluster bubbles and tooltip buttons.

4. Zoom and pan usability
- Keep wheel zoom isolated to the chart.
- Add safe min/max zoom limits.
- Clamp panning to a reasonable data range.
- Keep reset zoom restoring the exact full chart view.

5. Interaction polish
- Clicking a cluster zooms into the cluster.
- Clicking a single product dot opens the right detail panel.
- Tooltip buttons remain clickable.
- Cluster count labels stay centered and readable.

Files to change:
- `src/components/profitability/ScatterPlotChart.tsx`
- `src/components/profitability/ScatterTooltipCard.tsx`