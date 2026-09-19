import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Star, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Home, 
  Cross, 
  ShieldAlert, 
  UserCheck, 
  Info,
  Heart,
  Coins
} from 'lucide-react';
import { Place, PlaceReview } from '../types';
import { formatTelLink, getWhatsAppUrl, getDirectionsUrl } from '../utils/distance';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onAddReview: (placeId: string, review: PlaceReview) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isSaved,
  onToggleSave,
  onAddReview
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [ratingVal, setRatingVal] = useState(5);
  const [safetyRatingVal, setSafetyRatingVal] = useState(5);

  if (!place) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleShare = () => {
    const text = `Check out ${place.name} (${place.subCategory}) in ${place.city}. Contact: ${place.phoneNumbers.primary}. Address: ${place.address}`;
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: PlaceReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      rating: ratingVal,
      date: 'Just now',
      comment: reviewComment.trim(),
      safetyRating: safetyRatingVal
    };

    onAddReview(place.id, newRev);
    setReviewerName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="place-detail-modal-container"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/15 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                {place.category === 'hostel' && "Women's Hostel & PG"}
                {place.category === 'temple' && 'Sacred Temple'}
                {place.category === 'hospital' && 'Women & Child Hospital'}
              </span>
              {place.verified && (
                <span className="bg-blue-500/30 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Verified Safe
                </span>
              )}
              {place.isOpen24x7 && (
                <span className="bg-emerald-500/30 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  24/7 Active
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white pt-1">
              {place.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {place.subCategory} • {place.area}, {place.city}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="text-slate-300 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"
              title="Share place info"
              aria-label="Share"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleSave(place.id)}
              className={`p-2 rounded-xl transition-colors ${
                isSaved ? 'text-rose-400 bg-rose-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove bookmark' : 'Save bookmark'}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              id="close-place-detail-btn"
              onClick={onClose}
              className="text-slate-300 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Phone Directory & Direct Calling Box */}
          <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              Verified Phone Directory & Contact Lines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Phone */}
              <div className="bg-white border border-rose-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Primary Reception</span>
                  <div className="font-bold text-sm text-slate-900">{place.phoneNumbers.primary}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(place.phoneNumbers.primary)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone === place.phoneNumbers.primary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={formatTelLink(place.phoneNumbers.primary)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                    title="Call Now"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Emergency / Warden / Casualty line */}
              {place.phoneNumbers.emergencyOrWarden && (
                <div className="bg-white border border-rose-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold text-rose-700 uppercase">
                      {place.category === 'hostel' && 'Warden Direct'}
                      {place.category === 'hospital' && 'Emergency Casualty / Ambulance'}
                      {place.category === 'temple' && 'Priest / Devasthanam Officer'}
                    </span>
                    <div className="font-bold text-sm text-slate-900">{place.phoneNumbers.emergencyOrWarden}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(place.phoneNumbers.emergencyOrWarden!)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Copy number"
                    >
                      {copiedPhone === place.phoneNumbers.emergencyOrWarden ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={formatTelLink(place.phoneNumbers.emergencyOrWarden)}
                      className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                      title="Call Direct Line"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Secondary Phone if present */}
              {place.phoneNumbers.secondary && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Secondary Desk</span>
                    <div className="font-bold text-sm text-slate-900">{place.phoneNumbers.secondary}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(place.phoneNumbers.secondary!)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Copy number"
                    >
                      {copiedPhone === place.phoneNumbers.secondary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={formatTelLink(place.phoneNumbers.secondary)}
                      className="bg-slate-800 hover:bg-slate-900 text-white p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp direct chat */}
              {place.phoneNumbers.whatsapp && (
                <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase">Official WhatsApp</span>
                    <div className="font-bold text-sm text-slate-900">{place.phoneNumbers.whatsapp}</div>
                  </div>
                  <a
                    href={getWhatsAppUrl(place.phoneNumbers.whatsapp, `Hello, I saw your listing for ${place.name} on Women's Safe Directory and would like more information.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {place.contactPerson && (
              <div className="mt-3 pt-2 border-t border-rose-200/80 text-xs text-slate-700 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-600" />
                <span><strong>Key In-Charge Contact:</strong> {place.contactPerson}</span>
              </div>
            )}
          </div>

          {/* Location & Navigation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" /> Complete Address & Landmark
              </span>
              <p className="text-sm font-medium text-slate-900">{place.address}</p>
              <p className="text-xs text-slate-500">Area: {place.area} • City: {place.city}</p>
            </div>

            <a
              id="google-maps-directions-btn"
              href={getDirectionsUrl(place.lat, place.lng, place.name)}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Directions on Google Maps</span>
            </a>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Overview & Highlights
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-xl p-3.5">
              {place.description}
            </p>
          </div>

          {/* Timings & Curfew */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-slate-600" /> Operating Timings
              </span>
              <p className="text-sm font-semibold text-slate-800">{place.timings}</p>
              {place.curfewTime && (
                <p className="text-xs text-rose-700 font-bold mt-1">
                  • Gate Curfew: {place.curfewTime}
                </p>
              )}
            </div>

            {/* Category specific details */}
            {place.category === 'hostel' && (
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Coins className="w-4 h-4 text-rose-600" /> Rent & Room Types
                </span>
                <p className="text-sm font-bold text-rose-700">{place.priceRange || 'Contact for rates'}</p>
                {place.sharingTypes && (
                  <p className="text-xs text-slate-600 mt-1">
                    Available: {place.sharingTypes.join(', ')}
                  </p>
                )}
              </div>
            )}

            {place.category === 'temple' && (
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Deity & Dress Code
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {place.presidingDeity ? `Deity: ${place.presidingDeity}` : 'Sacred Shrine'}
                </p>
                {place.dressCode && (
                  <p className="text-xs text-amber-800 mt-1">
                    Dress Code: {place.dressCode}
                  </p>
                )}
              </div>
            )}

            {place.category === 'hospital' && (
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" /> Emergency & Insurance
                </span>
                <p className="text-xs font-bold text-emerald-700">
                  Ambulance: {place.hasAmbulance24x7 ? '24/7 Available' : 'Available on request'}
                </p>
                {place.insuranceAccepted && (
                  <p className="text-xs text-slate-600 mt-1">
                    Insurance: {place.insuranceAccepted.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Safety & Security Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Safety & Security Protocols (Verified for Women)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {place.safetyFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50/60 border border-blue-100 rounded-lg p-2.5 text-xs text-slate-800 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities & Facilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Amenities & Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {place.amenities.map((item, idx) => (
                <span 
                  key={idx}
                  className="bg-slate-100 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-200/80 font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews & Community Feedback */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Community Safety Ratings & Feedback
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-slate-900 text-sm">{place.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Based on {place.reviews ? place.reviews.length : place.reviewCount} experiences
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                {showReviewForm ? 'Cancel' : '+ Share Your Experience'}
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-900">Add Women Safety Review</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (or Anonymous)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 font-medium">Safety Score:</span>
                    <select
                      value={safetyRatingVal}
                      onChange={(e) => setSafetyRatingVal(Number(e.target.value))}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                    >
                      <option value={5}>5 ★ - Extremely Safe</option>
                      <option value={4}>4 ★ - Very Safe</option>
                      <option value={3}>3 ★ - Moderate</option>
                      <option value={2}>2 ★ - Needs Better Security</option>
                      <option value={1}>1 ★ - Not Recommended</option>
                    </select>
                  </div>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Share details regarding security, warden behavior, lighting, hygiene, doctor availability, emergency speed, etc."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Existing reviews */}
            <div className="space-y-3">
              {place.reviews && place.reviews.length > 0 ? (
                place.reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        {rev.safetyRating && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                            Safety: {rev.safetyRating}★
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                  No written community feedback yet. Be the first woman to share safety feedback for this location!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with quick primary call */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs text-slate-500">
            For urgent security issues or immediate danger, call national helpline <strong className="text-rose-600">112</strong>.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              id="modal-footer-call-btn"
              href={formatTelLink(place.phoneNumbers.primary)}
              className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Primary ({place.phoneNumbers.primary})</span>
            </a>

            <button
              onClick={onClose}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
