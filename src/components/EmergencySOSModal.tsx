import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  Share2, 
  Send, 
  AlertOctagon, 
  MapPin, 
  HeartHandshake, 
  Check, 
  Clock, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/mockPlaces';
import { Place, Coordinates } from '../types';
import { formatDistance, formatTelLink, getWhatsAppUrl } from '../utils/distance';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords: Coordinates;
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  userCoords,
  places,
  onSelectPlace
}) => {
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('emergency_guardian_phone') || '';
    const savedName = localStorage.getItem('emergency_guardian_name') || '';
    setGuardianPhone(savedPhone);
    setGuardianName(savedName);
  }, []);

  if (!isOpen) return null;

  const handleSaveGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('emergency_guardian_phone', guardianPhone);
    localStorage.setItem('emergency_guardian_name', guardianName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const mapLink = `https://maps.google.com/?q=${userCoords.lat},${userCoords.lng}`;
  const sosMessage = `EMERGENCY ALERT: I am a woman in need of immediate assistance or safety check. My live location: ${mapLink} (Coordinates: ${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}). Please reach out immediately!`;

  // Find nearest 24/7 hospitals
  const emergencyHospitals = places
    .filter((p) => p.category === 'hospital' && p.isOpen24x7)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="emergency-sos-dialog"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-rose-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white p-5 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
              <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Women’s Emergency & SOS Desk</h2>
                <span className="bg-white/25 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wider">
                  24x7 Active
                </span>
              </div>
              <p className="text-rose-100 text-xs mt-1">
                Instant one-tap dialing for national safety helplines & live GPS alert sharing
              </p>
            </div>
          </div>
          <button
            id="close-sos-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Quick Guardian SOS Broadcast */}
          <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-rose-600" />
                Live Location SOS to Guardian
              </span>
              <span className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </span>
            </div>

            <p className="text-xs text-slate-700 mb-3">
              One-tap sends your exact current GPS coordinates and an emergency help request to your family member, friend, or warden.
            </p>

            <form onSubmit={handleSaveGuardian} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
              <input
                id="guardian-name-input"
                type="text"
                placeholder="Guardian Name (e.g. Mom, Sister, Friend)"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="sm:col-span-4 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <input
                id="guardian-phone-input"
                type="tel"
                placeholder="Guardian Phone (10 digits)"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="sm:col-span-5 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="sm:col-span-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                {isSaved ? 'Saved!' : 'Save Guardian'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <a
                id="whatsapp-sos-btn"
                href={getWhatsAppUrl(guardianPhone || '', sosMessage)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Alert via WhatsApp</span>
              </a>

              <a
                id="sms-sos-btn"
                href={`sms:${guardianPhone}?body=${encodeURIComponent(sosMessage)}`}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Send Emergency SMS</span>
              </a>
            </div>
          </div>

          {/* National & State Emergency Helplines */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-slate-600" />
              Direct Emergency Helplines (Toll-Free & 24/7)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_NUMBERS.map((item) => (
                <div
                  key={item.code}
                  className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.iconColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
                      {item.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <a
                    id={`call-emergency-${item.code}`}
                    href={`tel:${item.code}`}
                    className="bg-slate-900 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                    title={`Call ${item.name} (${item.code})`}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest 24/7 Emergency Hospitals */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-600" />
              Nearest 24/7 Casualty & Maternity Hospitals
            </h3>

            <div className="space-y-2">
              {emergencyHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{hosp.name}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24/7 Open
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {hosp.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={formatTelLink(hosp.phoneNumbers.emergencyOrWarden || hosp.phoneNumbers.primary)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Casualty</span>
                    </a>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPlace(hosp);
                      }}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Helpline calls are toll-free. Stay calm and share your landmark.
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
