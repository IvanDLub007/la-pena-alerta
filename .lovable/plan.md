

## Problem

`react-leaflet` v5.0.0 requires React 19, but the project uses React 18.3.1. This causes the Vercel deployment to fail due to peer dependency conflicts.

## Plan

### 1. Downgrade react-leaflet in package.json (line 59)

Change `"react-leaflet": "^5.0.0"` to `"react-leaflet": "^4.2.1"`.

### 2. Verify component compatibility

The current `RiskMap.tsx` does **not** use `react-leaflet` React components (`MapContainer`, `TileLayer`, etc.) — it imports Leaflet directly via `await import("leaflet")` and uses the vanilla JS API. This means the downgrade has zero impact on the map component code. No changes needed in `RiskMap.tsx`, `MapLayerControls.tsx`, or `layerData.ts`.

### 3. Reinstall dependencies

Run `npm install` (or `bun install`) to update the lockfile with the corrected version.

---

**Summary**: Single-line change in `package.json`. No component code changes required since the map is built with vanilla Leaflet, not react-leaflet components.

