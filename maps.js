// Map slides (journey, guess, pins) on MapLibre + OpenFreeMap (no API key).
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

function arc(a, b, n = 96) {
  // Great-circle interpolation between [lng, lat] points.
  const r = Math.PI / 180, toV = ([lng, lat]) => [Math.cos(lat * r) * Math.cos(lng * r), Math.cos(lat * r) * Math.sin(lng * r), Math.sin(lat * r)];
  const A = toV(a), B = toV(b);
  const d = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s1 = Math.sin((1 - t) * d) / Math.sin(d), s2 = Math.sin(t * d) / Math.sin(d);
    const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
    out.push([Math.atan2(y, x) / r, Math.atan2(z, Math.hypot(x, y)) / r]);
  }
  return out;
}

function km(a, b) {
  const r = Math.PI / 180, dLat = (b[1] - a[1]) * r, dLng = (b[0] - a[0]) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(s));
}

function pinEl(color, cls = '') {
  const e = document.createElement('div');
  e.className = 'pin ' + cls;
  e.style.setProperty('--c', color);
  return e;
}

function newMap(container, view, interactive) {
  return new maplibregl.Map({
    container, style: MAP_STYLE, center: view.center, zoom: view.zoom, pitch: view.pitch || 0, bearing: view.bearing || 0,
    interactive: !!interactive, attributionControl: { compact: true }, fadeDuration: 0
  });
}

function addKaszuby(map) {
  map.addSource('kaszuby', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [window.KASZUBY] } } });
  map.addLayer({ id: 'kaszuby-fill', type: 'fill', source: 'kaszuby', paint: { 'fill-color': '#FFCC00', 'fill-opacity': 0.28 } });
  map.addLayer({ id: 'kaszuby-line', type: 'line', source: 'kaszuby', paint: { 'line-color': '#0B1F3A', 'line-width': 3, 'line-dasharray': [2, 1] } });
}

// Presenter journey: one map, many steps.
function journeyMap(container, onReady) {
  const stops = window.STOPS;
  const first = stops[0];
  const map = newMap(container, { center: first.at, zoom: first.zoom, pitch: first.pitch }, false);
  let timer = null;
  map.on('load', () => {
    addKaszuby(map);
    map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } });
    map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#003399', 'line-width': 5 }, layout: { 'line-cap': 'round' } });
    stops.forEach((s, i) => {
      if (s.fly) return;
      const el = pinEl(s.id === 'kaszuby' ? '#0B1F3A' : '#003399', 'stop');
      el.textContent = s.id === 'kaszuby' ? '★' : String(i);
      new maplibregl.Marker({ element: el }).setLngLat(s.at).addTo(map);
    });
    onReady && onReady();
  });
  function show(i) {
    const s = stops[i];
    clearInterval(timer);
    const src = map.getSource('route');
    if (s.fly && src) {
      const line = arc(s.fly[0], s.fly[1]);
      map.fitBounds([[Math.min(s.fly[0][0], s.fly[1][0]) - 2, Math.min(s.fly[0][1], s.fly[1][1]) - 2], [Math.max(s.fly[0][0], s.fly[1][0]) + 2, Math.max(s.fly[0][1], s.fly[1][1]) + 2]], { pitch: 25, duration: 1800 });
      let k = 0;
      setTimeout(() => {
        timer = setInterval(() => {
          k += 2;
          src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: line.slice(0, k) } });
          if (k >= line.length) clearInterval(timer);
        }, 30);
      }, 1800);
    } else {
      map.flyTo({ center: s.at, zoom: s.zoom, pitch: s.pitch, bearing: s.bearing, duration: 3500, essential: true });
    }
  }
  return { map, show, destroy() { clearInterval(timer); map.remove(); } };
}

// Map with live pins (guess and favourite places); presenter or phone.
function pinsMap(container, view, interactive) {
  const map = newMap(container, view, interactive);
  const markers = {};
  let truth = null;
  const lines = [];
  map.on('load', () => {
    map.addSource('lines', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'lines', type: 'line', source: 'lines', paint: { 'line-color': '#0B1F3A', 'line-width': 2, 'line-dasharray': [2, 2] } });
  });
  return {
    map,
    set(id, at, color) {
      if (markers[id]) { markers[id].setLngLat(at); return; }
      markers[id] = new maplibregl.Marker({ element: pinEl(color, 'drop'), anchor: 'bottom' }).setLngLat(at).addTo(map);
    },
    reveal(at, guesses) {
      if (!truth) truth = new maplibregl.Marker({ element: pinEl('#B3261E', 'truth'), anchor: 'bottom' }).setLngLat(at).addTo(map);
      const feats = guesses.map((g) => ({ type: 'Feature', geometry: { type: 'LineString', coordinates: [g, at] } }));
      const src = map.getSource('lines');
      if (src) src.setData({ type: 'FeatureCollection', features: feats });
      map.flyTo({ center: at, zoom: Math.max(map.getZoom(), 9), duration: 1500 });
    },
    destroy() { map.remove(); }
  };
}
