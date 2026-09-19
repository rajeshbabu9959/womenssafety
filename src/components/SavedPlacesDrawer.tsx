import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  PhoneCall, 
  MapPin, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Place } from '../types';
import { formatTelLink, getDirectionsUrl } from '../utils/distance';

interface SavedPlacesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: Place[];
  onRemoveSaved: (id: string) => void;
  onSelectPlace: (place: Place) => void;
}

export const SavedPlacesDrawer: React.FC<SavedPlacesDrawerProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  onRemoveSaved,
  onSelectPlace
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="saved-places-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-400 fill-rose-400" />
            <div>
              <h3 className="font-bold text-base text-white">Saved Safe Haven Places</h3>
              <p className="text-xs text-slate-400">{savedPlaces.length} locations bookmarked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedPlaces.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No places saved yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Bookmark hostels, temples, or emergency hospitals for instant access whenever you need them.
              </p>
            </div>
          ) : (
            savedPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                      {place.category} • {place.subCategory}
                    </span>
                    <h5 
                      onClick={() => {
                        onClose();
                        onSelectPlace(place);
                      }}
                      className="font-bold text-sm text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      {place.name}
                    </h5>
                  </div>
                  <button
                    onClick={() => onRemoveSaved(place.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{place.address}</span>
                </p>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <a
                    href={formatTelLink(place.phoneNumbers.primary)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-400" />
                    <span>Call ({place.phoneNumbers.primary})</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectPlace(place);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <span>View details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Stored on this device</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
