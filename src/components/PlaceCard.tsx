import React from 'react';
import { 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Bookmark, 
  Star, 
  Send, 
  Home, 
  Sparkles, 
  Cross, 
  UserCheck, 
  ChevronRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { Place } from '../types';
import { formatDistance, formatTelLink, getWhatsAppUrl, getDirectionsUrl } from '../utils/distance';

interface PlaceCardProps {
  place: Place;
  distanceKm: number;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  distanceKm,
  isSaved,
  onToggleSave,
  onSelect
}) => {
  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case 'hostel':
        return {
          icon: <Home className="w-3.5 h-3.5" />,
          label: "Women's Hostel",
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          accent: 'border-rose-500',
          badge: 'bg-rose-100 text-rose-800'
        };
      case 'temple':
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: 'Sacred Temple',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          accent: 'border-amber-500',
          badge: 'bg-amber-100 text-amber-900'
        };
      case 'hospital':
        return {
          icon: <Cross className="w-3.5 h-3.5" />,
          label: 'Hospital & Casualty',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: 'border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-900'
        };
      default:
        return {
          icon: <Home className="w-3.5 h-3.5" />,
          label: 'Safe Place',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          accent: 'border-slate-400',
          badge: 'bg-slate-100 text-slate-800'
        };
    }
  };

  const catConfig = getCategoryConfig(place.category);

  return (
    <div 
      id={`place-card-${place.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        {/* Top bar: Category badge, Verified, Distance & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catConfig.bg}`}>
              {catConfig.icon}
              <span>{catConfig.label}</span>
            </span>

            {place.verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Verified</span>
              </span>
            )}

            {place.isOpen24x7 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>24/7</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              {formatDistance(distanceKm)}
            </span>

            <button
              id={`save-place-btn-${place.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(place.id);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save for quick access'}
              aria-label="Bookmark place"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Place Title & SubCategory */}
        <div className="mb-2">
          <h3 
            onClick={() => onSelect(place)}
            className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
          >
            {place.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
            {place.subCategory} • {place.area}
          </p>
        </div>

        {/* Rating & reviews */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{place.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            ({place.reviewCount} reviews)
          </span>
          {place.contactPerson && (
            <span className="text-[11px] text-slate-600 ml-auto flex items-center gap-1 truncate max-w-[170px]" title={place.contactPerson}>
              <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{place.contactPerson}</span>
            </span>
          )}
        </div>

        {/* Address */}
        <div className="text-xs text-slate-600 flex items-start gap-1.5 mb-3 bg-slate-50 p-2 rounded-xl">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{place.address}</span>
        </div>

        {/* Category-Specific Highlight Box */}
        {place.category === 'hostel' && (
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 mb-3 text-xs space-y-1">
            {place.priceRange && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Coins className="w-3 h-3 text-rose-500" /> Rent:
                </span>
                <span className="font-bold text-rose-700">{place.priceRange}</span>
              </div>
            )}
            {place.curfewTime && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-400" /> Curfew:
                </span>
                <span className="font-semibold text-slate-700">{place.curfewTime}</span>
              </div>
            )}
          </div>
        )}

        {place.category === 'temple' && (
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 mb-3 text-xs space-y-1">
            {place.presidingDeity && (
              <div className="text-[11px]">
                <span className="text-amber-800 font-semibold">Deity: </span>
                <span className="text-slate-700 line-clamp-1">{place.presidingDeity}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" /> Darshan:
              </span>
              <span className="font-semibold text-slate-700 truncate max-w-[180px]">{place.timings}</span>
            </div>
          </div>
        )}

        {place.category === 'hospital' && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 mb-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-emerald-600" /> Emergency:
              </span>
              <span className="font-bold text-emerald-700">24/7 Casualty & Triage</span>
            </div>
            {place.specialities && (
              <p className="text-[11px] text-slate-600 truncate">
                {place.specialities.slice(0, 3).join(' • ')}
              </p>
            )}
          </div>
        )}

        {/* Safety Badges Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {place.safetyFeatures.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/60"
            >
              ✓ {feat}
            </span>
          ))}
          {place.safetyFeatures.length > 3 && (
            <span className="text-[10px] text-slate-500 font-medium px-1 py-0.5">
              +{place.safetyFeatures.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action buttons & Direct Calling footer */}
      <div className="bg-slate-50/90 border-t border-slate-200/70 p-3 sm:px-4 flex items-center gap-2">
        {/* Direct Call Button */}
        <a
          id={`call-btn-${place.id}`}
          href={formatTelLink(place.phoneNumbers.primary)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          title={`Call ${place.phoneNumbers.primary}`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call ({place.phoneNumbers.primary})</span>
        </a>

        {/* WhatsApp Button if present */}
        {place.phoneNumbers.whatsapp && (
          <a
            id={`whatsapp-btn-${place.id}`}
            href={getWhatsAppUrl(place.phoneNumbers.whatsapp, `Hello, I saw your listing for ${place.name} on Women's Safe Directory and would like to inquire.`)}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors shrink-0"
            title="Chat on WhatsApp"
          >
            <Send className="w-4 h-4" />
          </a>
        )}

        {/* View Details modal button */}
        <button
          id={`details-btn-${place.id}`}
          onClick={() => onSelect(place)}
          className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          title="View full information"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
