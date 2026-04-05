# Travels

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Reusable travel map web component for any website.

![Preview](http://i.imgur.com/7kFVWux.png)

See a live demo here: [https://robertmarsal.com/travels/](https://robertmarsal.com/travels/)

## What it is

This package exposes a custom element:

```html
<travels-map></travels-map>
```

It is framework-agnostic, so it can be used in plain HTML, React, Vue, Svelte,
Astro, or any other frontend that can load a browser module.

## Local development

```sh
git clone https://github.com/robertmarsal/travels.git
cd travels
npm install
npm run dev
```

The source now lives under `src/`:

- `src/travels-map/` contains the reusable component
- `src/demo/` contains the local demo page

## Build outputs

```sh
npm run build
```

This generates:

- `demo-dist/` for the demo site
- `dist/` for the reusable library bundle

## Usage

### Plain HTML with remote JSON

```html
<travels-map
    data-src="/travels.json"
    theme="dark-monochrome"
    center="38.957083,-39.074225"
    zoom="3"
    show-legends="true"
></travels-map>

<script type="module" src="/dist/travel-map.js"></script>
```

Your JSON can be either:

```json
{
  "points": [
    { "lat": 51.500736, "lng": -0.124625, "title": "London - United Kingdom" }
  ]
}
```

or a raw array of point objects.

### JavaScript property API

```js
import "travels";

const map = document.querySelector("travels-map");
map.points = [
    { lat: 51.500736, lng: -0.124625, title: "London - United Kingdom" },
];
```

## Public API

Attributes:

- `data-src`: URL returning JSON data
- `theme`: currently `dark-monochrome`
- `center`: fallback map center as `"lat,lng"`
- `zoom`: fallback zoom level when there are no points
- `show-legends`: set to `"false"` to hide legends
- `tiles-url`: optional custom tile URL template

Properties:

- `points`: array of `{ lat, lng, title }`

Styling:

- The component uses shadow DOM.
- You can theme it with CSS custom properties on `travels-map`, such as
  `--travel-marker`, `--travel-panel-bg`, and `--travel-map-bg`.

## Demo data

The local demo page reads from `src/demo/data.ts`.

## Notes

No API key is required. The component uses [Leaflet](https://leafletjs.com/)
with free map tiles by default.
