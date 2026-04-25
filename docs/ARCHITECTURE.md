# Architecture

## High-Level Flow

1. App starts from `src/main.tsx`.
2. `App.tsx` renders the page shell (header, input, scene, footer).
3. User submits URL.
4. URL is normalized (adds `https://` if missing) and stored as `activeUrl`.
5. URL is validated with `new URL(...)` to update status indicator.
6. When `activeUrl` exists, four `DeviceFrame` components are rendered.
7. Each `DeviceFrame` displays the same URL inside an iframe with device-specific frame styles and scale.

## Component Breakdown

## `App.tsx`

Main responsibilities:

- Stores user input (`urlInput`)
- Stores submitted URL (`activeUrl`)
- Tracks validity (`isUrlValid`)
- Renders:
  - Fixed top navigation with input and action buttons
  - Empty state when no URL exists
  - Multi-device scene when URL exists
  - Fixed footer branding

Key behavior:

- `handleUrlSubmit`:
  - Prevents default form submit
  - Adds `https://` if protocol missing
  - Sets `activeUrl`
- `useEffect` validates `activeUrl` by constructing `new URL(activeUrl)`

## `DeviceFrame.tsx`

Main responsibilities:

- Receives:
  - `type`: `monitor | laptop | tablet | mobile`
  - `url`: active preview URL
- Uses `DEVICE_CONFIG` for per-device style config:
  - Dimensions
  - Border radius and border thickness
  - Optional notch or stand
  - Content scale factor
- Renders draggable frame using Motion
- Renders iframe for the URL

Scaling strategy:

- Frame content is wrapped in a container sized to `1 / scale`.
- CSS transform applies `scale(...)` so more page content fits in smaller devices.

## Styling and Motion

- Tailwind utility classes are used directly in JSX.
- `motion/react` is used for:
  - Entry animation (`initial` -> `animate`)
  - Drag interaction (`drag`, `whileDrag`)

## Build and Runtime

- Vite handles dev/build.
- No backend service is required.
- No AI/LLM integration is present in runtime flow.
