import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { User, TradeType, CatalogServiceItem } from '../../types';
import { ACCRA_AREAS, SERVICE_CATALOG } from '../../data/catalog';
import {
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Navigation,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  PhoneCall,
  Search,
} from 'lucide-react';

interface ArtisanMapViewProps {
  pros: User[];
  currentAreaName: string;
  onBookArtisan: (proId: string, suggestedService?: CatalogServiceItem) => void;
}

export const ArtisanMapView: React.FC<ArtisanMapViewProps> = ({
  pros,
  currentAreaName,
  onBookArtisan,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const [selectedTrade, setSelectedTrade] = useState<TradeType | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState(currentAreaName || 'East Legon (American House)');
  const [showRadius, setShowRadius] = useState(true);
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const currentAreaObj = ACCRA_AREAS.find((a) => a.name.includes(selectedArea)) || ACCRA_AREAS[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentAreaObj.lat, currentAreaObj.lng],
        zoom: 13,
        zoomControl: false,
      });

      // CartoDB Positron / OSM tiles for crisp, clean map UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Add custom zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentAreaObj.lat, currentAreaObj.lng], 13);
    }
  }, [selectedArea]);

  // Update Markers and Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // User Location Pin
    const userLocationIcon = L.divIcon({
      className: 'user-pin-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute -inset-2 rounded-full bg-amber-500/30 animate-ping"></span>
          <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 text-white flex items-center justify-center shadow-lg font-black text-xs">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([currentAreaObj.lat, currentAreaObj.lng], { icon: userLocationIcon })
      .bindPopup(`
        <div class="p-2 font-sans text-xs">
          <strong class="text-slate-900 font-extrabold block">Your Location Pin</strong>
          <span class="text-amber-700 font-bold font-mono">${currentAreaObj.gpsPrefix}</span>
          <p class="text-slate-500 text-[11px] mt-0.5">${currentAreaObj.name}</p>
        </div>
      `);
    markersLayer.addLayer(userMarker);

    // Radius Circle
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
    }

    if (showRadius) {
      const circle = L.circle([currentAreaObj.lat, currentAreaObj.lng], {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6, 6',
        radius: 4000, // 4km radius
      }).addTo(map);
      radiusCircleRef.current = circle;
    }

    // Filter Pros
    const filteredPros = pros.filter((p) => {
      if (!p.proProfile) return false;
      if (selectedTrade !== 'all' && p.proProfile.trade !== selectedTrade) return false;
      return true;
    });

    // Color maps per trade
    const tradeColors: Record<string, { bg: string; border: string; label: string }> = {
      plumbing: { bg: '#0284c7', border: '#38bdf8', label: '🔧 Plumber' },
      electrical: { bg: '#d97706', border: '#fbbf24', label: '⚡ Electrician' },
      carpentry: { bg: '#b45309', border: '#f59e0b', label: '🪚 Carpenter' },
      painting: { bg: '#4f46e5', border: '#818cf8', label: '🎨 Painter' },
      pop_ceilings: { bg: '#7c3aed', border: '#a78bfa', label: '🏠 POP Artisan' },
      tiling: { bg: '#059669', border: '#34d399', label: '🧱 Tiler' },
    };

    filteredPros.forEach((pro, index) => {
      const trade = pro.proProfile?.trade || 'plumbing';
      const color = tradeColors[trade] || { bg: '#0f172a', border: '#f59e0b', label: '⚒️ Artisan' };

      // Offset slightly around Accra center to simulate real live locations
      const latOffset = (index === 0 ? 0.008 : index === 1 ? -0.012 : index === 2 ? 0.015 : -0.006) + (Math.sin(index * 2) * 0.005);
      const lngOffset = (index === 0 ? -0.01 : index === 1 ? 0.014 : index === 2 ? -0.008 : 0.018) + (Math.cos(index * 2) * 0.005);

      const proLat = currentAreaObj.lat + latOffset;
      const proLng = currentAreaObj.lng + lngOffset;

      const proIcon = L.divIcon({
        className: 'artisan-pin-icon',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer">
            <div class="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-md border" style="background-color: ${color.bg}; border-color: ${color.border};">
              ${pro.name.split(' ')[0]} ${pro.proProfile?.rating || 4.9}★
            </div>
            <div class="w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center font-bold text-xs shadow-lg mt-0.5" style="border-color: ${color.bg}; text-color: ${color.bg};">
              ${trade === 'plumbing' ? '🔧' : trade === 'electrical' ? '⚡' : trade === 'pop_ceilings' ? '🏠' : trade === 'tiling' ? '🧱' : '⚒️'}
            </div>
          </div>
        `,
        iconSize: [60, 50],
        iconAnchor: [30, 45],
      });

      const matchedService = SERVICE_CATALOG.find((s) => s.trade === trade);

      const marker = L.marker([proLat, proLng], { icon: proIcon });

      marker.on('click', () => {
        setSelectedPro(pro);
      });

      marker.bindPopup(`
        <div class="p-3 max-w-xs font-sans">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div class="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              ${pro.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 class="font-extrabold text-xs text-slate-900 leading-tight">${pro.name}</h4>
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                ${pro.proProfile?.tier || 'Growth'} Tier · ${color.label}
              </span>
            </div>
          </div>

          <div class="mt-2 space-y-1 text-[11px] text-slate-600">
            <div class="flex justify-between">
              <span>Rating:</span>
              <strong class="text-amber-600">${pro.proProfile?.rating}★ (${pro.proProfile?.jobsCompleted} jobs)</strong>
            </div>
            <div class="flex justify-between">
              <span>Problem Solved Rate:</span>
              <strong class="text-emerald-600">${pro.proProfile?.problemSolvedRate}%</strong>
            </div>
            <div class="flex justify-between">
              <span>Estimated Arrival:</span>
              <strong class="text-slate-900">~12–15 mins (${(1.2 + index * 0.8).toFixed(1)} km)</strong>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <button
              id="book-btn-${pro.id}"
              class="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-lg shadow-xs cursor-pointer text-center"
            >
              ⚡ Instant Dispatch (Escrow)
            </button>
          </div>
        </div>
      `);

      markersLayer.addLayer(marker);

      // Attach click listener for popup button after popup open
      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`book-btn-${pro.id}`);
          if (btn) {
            btn.onclick = () => {
              onBookArtisan(pro.id, matchedService);
            };
          }
        }, 50);
      });
    });
  }, [pros, selectedTrade, selectedArea, showRadius]);

  const tradeFilters: { key: TradeType | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: 'All Trades', icon: '🔍' },
    { key: 'plumbing', label: 'Plumbing', icon: '🔧' },
    { key: 'electrical', label: 'Electrical', icon: '⚡' },
    { key: 'carpentry', label: 'Carpentry', icon: '🪚' },
    { key: 'pop_ceilings', label: 'POP Ceilings', icon: '🏠' },
    { key: 'tiling', label: 'Tiling', icon: '🧱' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-0">
      {/* Top Map Filter & Location Bar */}
      <div className="p-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          <div>
            <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>Live Accra Vicinity Map</span>
              <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                Real-Time Artisans
              </span>
            </h3>
            <span className="text-[10px] text-slate-400">
              Showing verified pros within 4 km of {currentAreaObj.name}
            </span>
          </div>
        </div>

        {/* Neighborhood Area Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-transparent font-bold text-white text-xs focus:outline-none cursor-pointer"
          >
            {ACCRA_AREAS.map((a) => (
              <option key={a.name} value={a.name} className="bg-slate-900 text-white">
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trade Filter Pills */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tradeFilters.map((tf) => (
          <button
            key={tf.key}
            onClick={() => setSelectedTrade(tf.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              selectedTrade === tf.key
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-600'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tf.icon}</span>
            <span>{tf.label}</span>
          </button>
        ))}

        <button
          onClick={() => setShowRadius((r) => !r)}
          className={`ml-auto px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 border ${
            showRadius
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <span>📡 4km Radius</span>
        </button>
      </div>

      {/* Map Canvas Container */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-100">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Selected Artisan Floating Quick Card */}
        {selectedPro && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-sm z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-amber-300 animate-slide-up space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                  {selectedPro.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{selectedPro.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      {selectedPro.proProfile?.tier || 'Growth'} Tier
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Ghana Card Verified
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPro(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-xl text-center text-[10px]">
              <div>
                <span className="text-slate-400 block">Rating</span>
                <span className="font-bold text-amber-600">{selectedPro.proProfile?.rating}★</span>
              </div>
              <div>
                <span className="text-slate-400 block">Solved</span>
                <span className="font-bold text-emerald-600">{selectedPro.proProfile?.problemSolvedRate}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Distance</span>
                <span className="font-bold text-slate-900">~1.8 km</span>
              </div>
            </div>

            <button
              onClick={() => {
                const matchedSvc = SERVICE_CATALOG.find((s) => s.trade === selectedPro.proProfile?.trade);
                onBookArtisan(selectedPro.id, matchedSvc);
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Book {selectedPro.name.split(' ')[0]} Now (Escrow Covered)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
