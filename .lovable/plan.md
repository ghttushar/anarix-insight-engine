

# Add Controls to Expanded Chart Dialog

## Problem
The expanded (full-screen) chart dialog only shows the title and the chart content. It lacks the metric selector, visualization type dropdown, and extra controls (e.g. frequency) that are available in the inline view.

## Change
**Single file**: `src/components/charts/ChartContainer.tsx`

Add the same control bar (extraControls + Metrics popover + Viz type Select) into the `DialogHeader` area of the expanded dialog, between the title and the chart. Reuse the exact same markup/logic already in the inline header — extract the controls into a shared render function to avoid duplication.

Layout inside dialog:
```
DialogTitle (left) | [extraControls] [Metrics] [Viz type] (right)
─────────────────────────────────────────────────────────
Chart content (full height)
```

No other files need changes — all consumers already pass the props; controls will automatically appear in expanded view.

