import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Bookmark, 
  PlusCircle, 
  Compass,
  PhoneCall
} from 'lucide-react';
import { CityPreset } from '../types';

interface HeaderProps {
  cities: CityPreset[];
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  isUsingLiveGps: boolean;
  onUseLiveGps: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSos: () => void;
  onOpenAddPlace: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  isUsingLiveGps,
  onUseLiveGps,
  savedCount,
  onOpenSaved,
  onOpenSos,
  onOpenAddPlace
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top emergency quick bar */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-pink-700 text-white px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Women’s 24/7 Helpline Active:</span>
            <a href="tel:1091" className="underline font-bold hover:text-rose-100 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 1091
            </a>
            <span className="hidden sm:inline opacity-70">|</span>
            <span className="hidden sm:inline">National SOS:</span>
            <a href="tel:112" className="hidden sm:inline underline font-bold hover:text-rose-100">
              112
            </a>
            <span className="hidden md:inline opacity-70">|</span>
            <span className="hidden md:inline">Ambulance:</span>
            <a href="tel:108" className="hidden md:inline underline font-bold hover:text-rose-100">
              108
            </a>
          </div>
          <button
            id="emergency-sos-top-btn"
            onClick={onOpenSos}
            className="bg-white text-rose-700 hover:bg-rose-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Emergency SOS & Contacts</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo & App branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span>Women’s Safe Directory</span>
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Near-by Hostels, Sacred Temples & 24/7 Hospitals with direct contact numbers
              </p>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSaved}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              title="Saved places"
              aria-label="Saved places"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenSos}
              className="bg-rose-600 text-white p-2 rounded-lg shadow-sm hover:bg-rose-700"
              title="Emergency SOS"
              aria-label="Emergency SOS"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* City selector, GPS locator and actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Location selector */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <button
              id="btn-use-live-gps"
              onClick={onUseLiveGps}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                isUsingLiveGps
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Use current GPS location"
            >
              <Compass className={`w-3.5 h-3.5 ${isUsingLiveGps ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">My Live</span> GPS
            </button>

            <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>

            <div className="flex items-center gap-1 px-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <select
                id="city-selector"
                value={selectedCity.id}
                onChange={(e) => {
                  const found = cities.find((c) => c.id === e.target.value);
                  if (found) onSelectCity(found);
                }}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer py-1 pr-1"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bookmarks */}
          <button
            id="btn-saved-places"
            onClick={onOpenSaved}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-500" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full text-[11px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Add a Place / Community contribution */}
          <button
            id="btn-add-place"
            onClick={onOpenAddPlace}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">List a</span> Place
          </button>
        </div>
      </div>
    </header>
  );
};
