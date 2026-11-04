'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Cat, LocateFixed, Minus, Plus } from 'lucide-react';

const HOME = { lat: 10.7202, lon: 122.5621 };
const TILE = 256;
const TILE_URL = 'https://tile.openstreetmap.org';
function project(lat: number, lon: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const sin = Math.sin(lat * Math.PI / 180);
  return { x: (lon + 180) / 360 * scale, y: (.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale };
}

export default function IloiloMap() {
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; origin: { x: number; y: number } } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 158 });
  const [zoom, setZoom] = useState(11);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [markerOpen, setMarkerOpen] = useState(false);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    resize.observe(element);
    visibility.observe(element);
    return () => { resize.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  const home = project(HOME.lat, HOME.lon, zoom);
  const center = { x: home.x - offset.x, y: home.y - offset.y };
  const left = center.x - size.width / 2;
  const top = center.y - size.height / 2;
  const tiles = [];
  if (size.width) {
    for (let x = Math.floor(left / TILE); x <= Math.floor((left + size.width) / TILE); x++) {
      for (let y = Math.floor(top / TILE); y <= Math.floor((top + size.height) / TILE); y++) {
        tiles.push({ x, y, left: x * TILE - left, top: y * TILE - top });
      }
    }
  }
  const move = (x: number, y: number) => setOffset(current => ({ x: Math.max(-size.width * 2, Math.min(size.width * 2, current.x + x)), y: Math.max(-size.height * 2, Math.min(size.height * 2, current.y + y)) }));
  const changeZoom = (delta: number) => { setZoom(value => Math.min(14, Math.max(9, value + delta))); setOffset({ x: 0, y: 0 }); };
  const reset = () => { setZoom(11); setOffset({ x: 0, y: 0 }); setMarkerOpen(true); };

  return <div className="iloilo-map-block">
    <div className="iloilo-map-heading"><span><span className="iloilo-status-dot" />Iloilo City, Philippines</span></div>
    <div ref={frame} className="iloilo-map" role="group" aria-label="Interactive map centered on Iloilo City. Drag to explore, or use the arrow keys and map controls." tabIndex={0} data-paused={!visible || !tabVisible}
      onKeyDown={event => {
        const keys: Record<string, [number, number]> = { ArrowLeft: [64, 0], ArrowRight: [-64, 0], ArrowUp: [0, 64], ArrowDown: [0, -64] };
        if (keys[event.key]) { event.preventDefault(); move(...keys[event.key]); }
        if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1); }
        if (event.key === '-') { event.preventDefault(); changeZoom(-1); }
        if (event.key === 'Home') { event.preventDefault(); reset(); }
      }}
      onPointerDown={event => {
        if ((event.target as HTMLElement).closest('button, a')) return;
        drag.current = { x: event.clientX, y: event.clientY, origin: offset };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        if (!drag.current) return;
        setOffset({ x: Math.max(-size.width * 2, Math.min(size.width * 2, drag.current.origin.x + event.clientX - drag.current.x)), y: Math.max(-size.height * 2, Math.min(size.height * 2, drag.current.origin.y + event.clientY - drag.current.y)) });
      }}
      onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
      <div className="iloilo-map-tiles" aria-hidden="true">
        {tiles.map(tile => <Image key={`${zoom}/${tile.x}/${tile.y}`} src={`${TILE_URL}/${zoom}/${tile.x}/${tile.y}.png`} alt="" unoptimized draggable={false} width={256} height={256} onError={() => setTileError(true)} style={{ position: 'absolute', left: tile.left, top: tile.top, width: 256, height: 256, maxWidth: 'none' }} />)}
      </div>
      <div className="iloilo-home-marker" style={{ left: size.width / 2 + offset.x, top: size.height / 2 + offset.y }}>
        <span className="iloilo-marker-ping" aria-hidden="true" />
        <button type="button" className="iloilo-cat-pin" onClick={() => setMarkerOpen(value => !value)} aria-expanded={markerOpen} aria-label="Show Iloilo City location note"><Cat size={23} strokeWidth={1.8} aria-hidden="true" /></button>
        {markerOpen && <div className="iloilo-marker-note"><strong>Home, with Mingkay.</strong><span>Iloilo City · City of Love</span></div>}
      </div>
      <div className="iloilo-map-controls" onKeyDown={event => event.stopPropagation()}>
        <button type="button" onClick={() => changeZoom(1)} disabled={zoom === 14} aria-label="Zoom in"><Plus size={17} /></button>
        <button type="button" onClick={() => changeZoom(-1)} disabled={zoom === 9} aria-label="Zoom out"><Minus size={17} /></button>
        <button type="button" onClick={reset} aria-label="Recenter on Iloilo City" title="Back to Iloilo"><LocateFixed size={17} /></button>
      </div>
      <div className="iloilo-map-credit">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors</div>
      {tileError && <div className="iloilo-map-error" role="status">Map tiles couldn’t load. <a href="https://www.openstreetmap.org/#map=12/10.7202/122.5621" target="_blank" rel="noreferrer">Open Iloilo on the map</a></div>}
    </div>

  </div>;
}
