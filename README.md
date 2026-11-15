# Forma — Furniture & 3D Studio

A furniture website concept built with React and Three.js. Explore the collection, try chair colors, and place a chair inside an interactive 3D room. Includes Home, Products, About, and Contact pages.

## Getting started

Use **Node.js 26.x** and npm. If you use nvm, the included `.nvmrc` selects the correct version:

```bash
nvm install
nvm use
npm ci
npm run dev
```

If Node.js 26 is already installed, start with `npm ci`. Open the local URL printed by Vite in your terminal.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production site in `dist/` |
| `npm run preview` | Preview the production build locally after building |
| `npm run lint` | Check JavaScript and JSX with ESLint |

## What we use

- **React 18** — pages, components, and interactive controls.
- **Vite + SWC** — local development and production builds.
- **Three.js** — the WebGL renderer, 3D chair, lighting, shadows, and room.
- **GSAP** — animation helpers and scroll effects in the section components.
- **CSS + Tailwind CSS** — styling and utility classes.
- **ESLint** — code checks.

## The 3D part

The studio loads the chair from `public/assets/modal/real-chair.gltf` using Three.js `GLTFLoader`. The surrounding room is built in code from simple shapes: a floor, walls, rug, wall art, and a potted plant.

- **Place chair:** drag the chair across the floor, or focus the 3D view and use the arrow keys.
- **Orbit view:** drag to look around the room and scroll to zoom using `OrbitControls`.
- **Colors:** select a swatch to preview a different chair finish.
- **Room styles:** switch between Warm studio, Sage retreat, and Urban gallery.
- **Playback:** start or pause chair rotation, or reset the placement and view.

Walls hide when the camera moves behind them so the chair stays visible. The 3D viewer needs a browser with WebGL support. Colors and room previews are illustrative.

## Main files

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Shared layout and page selection |
| `src/pages/` | Home, Products, About, and Contact pages |
| `src/components/Studio.jsx` | Studio controls and finish selector |
| `src/sections/hero/Modal.jsx` | Three.js scene, model loading, and interaction |
| `src/utils/createRoom.js` | Room geometry, palettes, and cutaway walls |
| `src/data/catalog.js` | Chair finishes and catalog data |
| `src/App.css` | Main website styles |
| `public/assets/` | Models, images, and other static assets |

## Notes

The contact page prepares an enquiry that you can open in an email app, copy, or download. It does not send messages through a backend.

Visual reference: [CodePen by dilums](https://codepen.io/dilums/pen/NWodZMd).
