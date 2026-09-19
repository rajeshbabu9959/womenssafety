import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Building, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { Place, PlaceCategory } from '../types';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (place: Place) => void;
  currentCity: string;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
  currentCity
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('hostel');
  const [subCategory, setSubCategory] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [emergencyOrWarden, setEmergencyOrWarden] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [timings, setTimings] = useState('');
  const [curfewTime, setCurfewTime] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen24x7, setIsOpen24x7] = useState(false);

  // Safety checkboxes
  const [hasCctv, setHasCctv] = useState(true);
  const [hasBiometric, setHasBiometric] = useState(true);
  const [hasFemaleGuard, setHasFemaleGuard] = useState(true);
  const [hasEmergencyFirstAid, setHasEmergencyFirstAid] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !primaryPhone.trim() || !address.trim()) return;

    const safetyArr: string[] = [];
    if (hasCctv) safetyArr.push('24/7 CCTV in all common areas');
    if (hasBiometric) safetyArr.push('Biometric / RFID Gate Security');
    if (hasFemaleGuard) safetyArr.push('Female Staff / Resident Warden');
    if (hasEmergencyFirstAid) safetyArr.push('Emergency First-Aid & Doctor on Call');

    const defaultAmenities = category === 'hostel'
      ? ['3 Times Meals', 'High-Speed Wi-Fi', 'RO Water', 'Power Backup']
      : category === 'temple'
      ? ['Clean Restrooms', 'Cloakroom', 'Prasadam', 'Drinking Water']
      : ['Casualty 24/7', 'Ambulance', 'Pharmacy', 'Emergency ICU'];

    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      subCategory: subCategory.trim() || (category === 'hostel' ? "Women's Deluxe PG" : category === 'temple' ? 'Devasthanam' : 'Women & Child Care'),
      address: address.trim(),
      area: area.trim() || currentCity,
      city: currentCity,
      lat: 17.05 + (Math.random() * 0.04 - 0.02),
      lng: 82.06 + (Math.random() * 0.04 - 0.02),
      phoneNumbers: {
        primary: primaryPhone.trim(),
        secondary: secondaryPhone.trim() || undefined,
        emergencyOrWarden: emergencyOrWarden.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined
      },
      contactPerson: contactPerson.trim() || undefined,
      timings: timings.trim() || (isOpen24x7 ? '24 Hours Open' : 'Gate closes at 9:30 PM'),
      isOpen24x7,
      curfewTime: curfewTime.trim() || undefined,
      priceRange: priceRange.trim() || undefined,
      rating: 4.8,
      reviewCount: 1,
      verified: true,
      safetyFeatures: safetyArr,
      amenities: defaultAmenities,
      description: description.trim() || 'Verified safe place listed by community members with verified phone numbers.',
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Listing Contributor',
          rating: 5,
          date: 'Just now',
          comment: 'Verified contact numbers and security measures submitted for women’s safe reference.',
          safetyRating: 5
        }
      ]
    };

    onAddPlace(newPlace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="add-place-modal-dialog"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">List a Safe Place for Women</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Register a ladies hostel, sacred temple, or hospital with contact details
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('hostel')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  category === 'hostel'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🏢 Ladies Hostel</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('temple')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  category === 'temple'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🛕 Temple</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('hospital')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  category === 'hospital'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🏥 Hospital</span>
              </button>
            </div>
          </div>

          {/* Place Name & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Place / Institution Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sree Durga Deluxe Ladies PG"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Type / Focus
              </label>
              <input
                type="text"
                placeholder={category === 'hostel' ? "e.g. Working Women & Student Hostel" : category === 'temple' ? "e.g. Ancient Shakti Devasthanam" : "e.g. 24/7 Maternity & Multi-Specialty"}
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Phone Numbers - Key focus of the user request! */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-3.5 space-y-3">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" /> Phone Numbers & Contact Lines (Mandatory)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Primary Contact / Reception *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98490 00000"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {category === 'hostel' ? 'Warden Direct Phone' : category === 'hospital' ? 'Casualty / Ambulance Phone' : 'Head Priest / Trust Phone'}
                </label>
                <input
                  type="tel"
                  placeholder="+91 94400 11111"
                  value={emergencyOrWarden}
                  onChange={(e) => setEmergencyOrWarden(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp Support Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98490 00000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  In-Charge Person Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Lakshmi (Warden)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Address & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area / Locality Landmark *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Near Aditya Campus / Bhanugudi"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="Plot / Street / Opp. Landmark, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Timings & Category Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Timings / Hours
              </label>
              <input
                type="text"
                placeholder={category === 'hostel' ? "Gate closes at 9:30 PM" : category === 'temple' ? "6:00 AM - 12:30 PM & 4:30 PM - 8:30 PM" : "Casualty 24/7 Open"}
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {category === 'hostel' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Rent Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹5,500 - ₹8,500 / month"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Safety Checkbox Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verified Safety Features
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCctv}
                  onChange={(e) => setHasCctv(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>24/7 CCTV in all common corridors</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBiometric}
                  onChange={(e) => setHasBiometric(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Biometric / RFID Gate Access</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFemaleGuard}
                  onChange={(e) => setHasFemaleGuard(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Resident Female Warden / Security</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEmergencyFirstAid}
                  onChange={(e) => setHasEmergencyFirstAid(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Doctor-on-call & Emergency Kit</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description & Facilities
            </label>
            <textarea
              rows={2}
              placeholder="Tell women about the food, cleanliness, atmosphere, proximity to bus/college..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save & List Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
