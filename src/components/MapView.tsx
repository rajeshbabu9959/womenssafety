import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Home, 
  Sparkles, 
  Cross, 
  PhoneCall, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Clock, 
  Star,
  Maximize2
} from 'lucide-react';
import { Place, Coordinates } from '../types';
import { formatDistance, formatTelLink, getDirectionsUrl } from '../utils/distance';

interface MapViewProps {
  places: Place[];
  userCoords: Coordinates;
  onSelectPlace: (place: Place) => void;
  selectedPlaceId?: string;
  cityName: string;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  userCoords,
  onSelectPlace,
  selectedPlaceId,
  cityName
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePlace, setActivePlace] = useState<Place | null>(
    places.find((p) => p.id === selectedPlaceId) || places[0] || null
  );

  // Compute bounding box or relative coordinate projection
  const bounds = useMemo(() => {
    if (places.length === 0) {
      return { minLat: userCoords.lat - 0.05, maxLat: userCoords.lat + 0.05, minLng: userCoords.lng - 0.05, maxLng: userCoords.lng + 0.05 };
    }
    const allLats = [...places.map((p) => p.lat), userCoords.lat];
    const allLngs = [...places.map((p) => p.lng), userCoords.lng];
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);
    const latSpan = Math.max(maxLat - minLat, 0.04);
    const lngSpan = Math.max(maxLng - minLng, 0.04);

    return {
      minLat: minLat - latSpan * 0.15,
      maxLat: maxLat + latSpan * 0.15,
      minLng: minLng - lngSpan * 0.15,
      maxLng: maxLng + lngSpan * 0.15
    };
  }, [places, userCoords]);

  // Project lat/lng to percentage X/Y
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;
    // Invert Y because latitude increases northward (upwards)
    const x = ((lng - bounds.minLng) / (lngRange || 1)) * 100;
    const y = ((bounds.maxLat - lat) / (latRange || 1)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y))
    };
  };

  const userPos = getCoordinatesPercent(userCoords.lat, userCoords.lng);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col h-[580px]">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-2xl pointer-events-auto flex items-center gap-2 shadow-lg">
          <Navigation className="w-4 h-4 text-rose-500 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{cityName} Safe Locator</span>
              <span className="bg-rose-500/30 text-rose-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                {places.length} Places Plotted
              </span>
            </span>
            <span className="text-[10px] text-slate-400 block">
              Click pins to view contact numbers & timings
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl pointer-events-auto text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Hostels
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Temples
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Hospitals
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span> You
          </span>
        </div>
      </div>

      {/* Map Canvas / Grid Stage */}
      <div className="relative w-full h-full bg-[#161e2e] overflow-hidden select-none">
        {/* Subtle Map Grid Lines & Roads styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#2c3b53_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
        {/* Stylized road network vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="0%" y1="35%" x2="100%" y2="40%" stroke="#475569" strokeWidth="6" />
          <line x1="0%" y1="70%" x2="100%" y2="65%" stroke="#475569" strokeWidth="4" />
          <line x1="30%" y1="0%" x2="40%" y2="100%" stroke="#475569" strokeWidth="5" />
          <line x1="75%" y1="0%" x2="70%" y2="100%" stroke="#475569" strokeWidth="4" />
          <circle cx={userPos.x + '%'} cy={userPos.y + '%'} r="60" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '20s' }} />
          <circle cx={userPos.x + '%'} cy={userPos.y + '%'} r="110" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
        </svg>

        {/* User GPS Pin */}
        <div
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></span>
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <Compass className="w-3 h-3" />
            </div>
          </div>
          <span className="bg-blue-900/90 text-blue-200 border border-blue-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-1 shadow-md whitespace-nowrap">
            Your GPS
          </span>
        </div>

        {/* Place Markers */}
        {places.map((place) => {
          const pos = getCoordinatesPercent(place.lat, place.lng);
          const isSelected = activePlace?.id === place.id;

          let pinBg = 'bg-rose-600 text-white';
          let ringColor = 'border-rose-400';
          let PinIcon = Home;

          if (place.category === 'temple') {
            pinBg = 'bg-amber-600 text-white';
            ringColor = 'border-amber-400';
            PinIcon = Sparkles;
          } else if (place.category === 'hospital') {
            pinBg = 'bg-emerald-600 text-white';
            ringColor = 'border-emerald-400';
            PinIcon = Cross;
          }

          return (
            <button
              key={place.id}
              onClick={() => {
                setActivePlace(place);
              }}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-full z-20 group transition-all duration-200 cursor-pointer focus:outline-none ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
              title={place.name}
            >
              <div className="flex flex-col items-center">
                {/* Marker badge */}
                <div
                  className={`p-1.5 rounded-xl ${pinBg} shadow-lg border-2 ${
                    isSelected ? 'border-white ring-4 ring-rose-400/40 scale-110' : ringColor
                  } flex items-center justify-center transition-transform`}
                >
                  <PinIcon className="w-4 h-4" />
                </div>
                {/* Pointer tip */}
                <div className={`w-2 h-2 rotate-45 -mt-1 ${pinBg}`}></div>

                {/* Marker label pill */}
                <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-md transition-all ${
                  isSelected 
                    ? 'bg-white text-slate-900 ring-2 ring-rose-500' 
                    : 'bg-slate-900/80 text-slate-200 border border-slate-700/80 group-hover:bg-slate-800'
                }`}>
                  {place.name.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-16 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
          className="bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-xl border border-slate-700 shadow-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-xl border border-slate-700 shadow-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Active Place Preview Card */}
      {activePlace && (
        <div className="absolute bottom-4 left-4 right-4 z-20 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  activePlace.category === 'hostel' ? 'bg-rose-100 text-rose-800' :
                  activePlace.category === 'temple' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {activePlace.subCategory}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {activePlace.area}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  {activePlace.rating.toFixed(1)}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 truncate">
                {activePlace.name}
              </h4>

              <p className="text-xs text-slate-500 truncate">
                {activePlace.address}
              </p>
            </div>

            {/* Actions for active place */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={formatTelLink(activePlace.phoneNumbers.primary)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call ({activePlace.phoneNumbers.primary})</span>
              </a>

              <a
                href={getDirectionsUrl(activePlace.lat, activePlace.lng, activePlace.name)}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs p-2 rounded-xl flex items-center justify-center"
                title="Directions on Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => onSelectPlace(activePlace)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-xs"
              >
                Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
