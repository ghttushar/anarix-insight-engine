
## URL-Based Theme Switching for Component Library

### What You Need
Separate URLs for light and dark mode screenshots:
- `/settings/component-library?theme=light` → Forces light mode
- `/settings/component-library?theme=dark` → Forces dark mode
- `/settings/component-library` (no param) → Defaults to light

### Implementation

**Single file change: `src/pages/settings/ComponentLibrary.tsx`**

1. Import `useSearchParams` from `react-router-dom`
2. Read the `theme` query parameter
3. Apply `light` or `dark` class to the showcase wrapper based on URL param
4. Add navigation links at the top of the page to switch between themes (so you can easily jump to each URL)

**Code changes:**
- Add `useSearchParams()` hook
- Extract `theme` param: `const theme = searchParams.get('theme') || 'light'`
- Change wrapper class from hardcoded `"light"` to dynamic `{theme === 'dark' ? 'dark' : 'light'}`
- Add a "Theme Selector" row at the top with links to both URL variants

### Result
You'll be able to:
- Visit `?theme=light` → Screenshot all components in light mode
- Visit `?theme=dark` → Screenshot all components in dark mode
- Click links on the page to toggle between URLs

### Files Modified
| File | Change |
|------|--------|
| `src/pages/settings/ComponentLibrary.tsx` | Add URL-based theme switching with `useSearchParams` |
