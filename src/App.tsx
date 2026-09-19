import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  AlertTriangle, 
  Search, 
  Building, 
  Home, 
  Sparkles, 
  Cross, 
  Clock, 
  Compass,
  Bookmark,
  Share2,
  Info,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Place, PlaceCategory, CityPreset, Coordinates, PlaceReview } from './types';
import { CITY_PRESETS, INITIAL_PLACES, EMERGENCY_NUMBERS } from './data/mockPlaces';
import { calculateDistanceKm } from './utils/distance';
import { Header } from './components/Header';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { MapView } from './components/MapView';
import { AddPlaceModal } from './components/AddPlaceModal';
import { SavedPlacesDrawer } from './components/SavedPlacesDrawer';

export default function App() {
  // Places state
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem('womens_app_places');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initial places if custom ones exist
        const customOnly = parsed.filter((p: Place) => p.id.startsWith('custom-'));
        return [...customOnly, ...INITIAL_PLACES];
      } catch (e) {
        console.error('Failed to parse saved places', e);
      }
    }
    return INITIAL_PLACES;
  });

  // Selected city & GPS location
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [userCoords, setUserCoords] = useState<Coordinates>(CITY_PRESETS[0].coords);
  const [isUsingLiveGps, setIsUsingLiveGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [open24x7Only, setOpen24x7Only] = useState(false);
  const [hasCctvOnly, setHasCctvOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Bookmarks / Saved Places
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('womens_saved_places');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [activeDetailPlace, setActiveDetailPlace] = useState<Place | null>(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Live GPS geolocation handler
  const handleUseLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsUsingLiveGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setIsUsingLiveGps(true);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setGpsError('Location access was denied or timed out. Switched to city center.');
        setIsUsingLiveGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // City selection change
  const handleSelectCity = (city: CityPreset) => {
    setSelectedCity(city);
    setUserCoords(city.coords);
    setIsUsingLiveGps(false);
    setGpsError(null);
  };

  // Bookmark toggle
  const handleToggleSave = (id: string) => {
    setSavedPlaceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('womens_saved_places', JSON.stringify(next));
      return next;
    });
  };

  // Add a new place
  const handleAddPlace = (newPlace: Place) => {
    setPlaces((prev) => {
      const next = [newPlace, ...prev];
      localStorage.setItem('womens_app_places', JSON.stringify(next));
      return next;
    });
    // Open the new place detail
    setActiveDetailPlace(newPlace);
  };

  // Add review to a place
  const handleAddReview = (placeId: string, review: PlaceReview) => {
    setPlaces((prev) => {
      const next = prev.map((p) => {
        if (p.id === placeId) {
          const reviews = [review, ...(p.reviews || [])];
          const newAvgRating = (p.rating * p.reviewCount + review.rating) / (p.reviewCount + 1);
          return {
            ...p,
            reviews,
            rating: Number(newAvgRating.toFixed(1)),
            reviewCount: p.reviewCount + 1
          };
        }
        return p;
      });
      localStorage.setItem('womens_app_places', JSON.stringify(next));
      return next;
    });

    // Update active place if open
    setActiveDetailPlace((prev) => {
      if (prev && prev.id === placeId) {
        const reviews = [review, ...(prev.reviews || [])];
        const newAvgRating = (prev.rating * prev.reviewCount + review.rating) / (prev.reviewCount + 1);
        return {
          ...prev,
          reviews,
          rating: Number(newAvgRating.toFixed(1)),
          reviewCount: prev.reviewCount + 1
        };
      }
      return prev;
    });
  };

  // Filtered places with distance
  const placesWithDistance = useMemo(() => {
    return places.map((place) => {
      const distance = calculateDistanceKm(userCoords, { lat: place.lat, lng: place.lng });
      return {
        ...place,
        distance
      };
    });
  }, [places, userCoords]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: places.length,
      hostel: places.filter((p) => p.category === 'hostel').length,
      temple: places.filter((p) => p.category === 'temple').length,
      hospital: places.filter((p) => p.category === 'hospital').length
    };
  }, [places]);

  // Filter & sort application
  const filteredPlaces = useMemo(() => {
    let result = placesWithDistance;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by verified
    if (verifiedOnly) {
      result = result.filter((p) => p.verified);
    }

    // Filter by 24x7
    if (open24x7Only) {
      result = result.filter((p) => p.isOpen24x7);
    }

    // Filter by CCTV / security
    if (hasCctvOnly) {
      result = result.filter((p) =>
        p.safetyFeatures.some((f) => /cctv|biometric|guard/i.test(f))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          (p.presidingDeity && p.presidingDeity.toLowerCase().includes(q)) ||
          (p.contactPerson && p.contactPerson.toLowerCase().includes(q)) ||
          (p.specialities && p.specialities.some((s) => s.toLowerCase().includes(q))) ||
          p.safetyFeatures.some((f) => f.toLowerCase().includes(q)) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [placesWithDistance, selectedCategory, verifiedOnly, open24x7Only, hasCctvOnly, searchQuery, sortBy]);

  const hasActiveFilters = Boolean(
    selectedCategory !== 'all' || verifiedOnly || open24x7Only || hasCctvOnly || searchQuery
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setVerifiedOnly(false);
    setOpen24x7Only(false);
    setHasCctvOnly(false);
    setSearchQuery('');
  };

  const savedPlacesList = useMemo(() => {
    return places.filter((p) => savedPlaceIds.includes(p.id));
  }, [places, savedPlaceIds]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Header with Navigation & Live Location */}
      <Header
        cities={CITY_PRESETS}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        isUsingLiveGps={isUsingLiveGps}
        onUseLiveGps={handleUseLiveGps}
        savedCount={savedPlaceIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenSos={() => setIsSosModalOpen(true)}
        onOpenAddPlace={() => setIsAddPlaceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* GPS Alert Notice if needed */}
        {gpsError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
            <span>{gpsError}</span>
            <button
              onClick={() => setGpsError(null)}
              className="font-bold underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Context Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dedicated Safe Space & Emergency Directory for Women</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Find Verified Women Hostels, Sacred Temples & 24/7 Hospitals Nearby
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Equipped with direct phone numbers for female resident wardens, casualty emergency desks, temple priests, and live GPS distance navigation.
            </p>

            {/* Quick Summary Highlights */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <button
                onClick={() => setSelectedCategory('hostel')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-rose-400" />
                <span>Ladies Hostels ({categoryCounts.hostel})</span>
              </button>

              <button
                onClick={() => setSelectedCategory('temple')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Temples ({categoryCounts.temple})</span>
              </button>

              <button
                onClick={() => setSelectedCategory('hospital')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cross className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hospitals ({categoryCounts.hospital})</span>
              </button>

              <button
                onClick={() => setIsSosModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ml-auto"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />
                <span>SOS Alert Help</span>
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>
        </div>

        {/* Search, Category Tabs, Safety Filters & View Toggle */}
        <SearchBarAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          verifiedOnly={verifiedOnly}
          onToggleVerified={() => setVerifiedOnly(!verifiedOnly)}
          open24x7Only={open24x7Only}
          onToggleOpen24x7={() => setOpen24x7Only(!open24x7Only)}
          hasCctvOnly={hasCctvOnly}
          onToggleHasCctv={() => setHasCctvOnly(!hasCctvOnly)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Content Display: List Grid or Interactive Map View */}
        {viewMode === 'map' ? (
          <MapView
            places={filteredPlaces}
            userCoords={userCoords}
            onSelectPlace={(place) => setActiveDetailPlace(place)}
            cityName={selectedCity.name}
          />
        ) : (
          <div>
            {/* Results count header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} near {selectedCity.name}
              </span>
              <span className="text-xs text-slate-400">
                Sorted by {sortBy === 'distance' ? 'proximity' : sortBy === 'rating' ? 'ratings' : 'name'}
              </span>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching safe locations found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keyword or relaxing filter options to view more hostels, temples, or hospitals.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsAddPlaceOpen(true)}
                    className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    Add This Place
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    distanceKm={place.distance}
                    isSaved={savedPlaceIds.includes(place.id)}
                    onToggleSave={handleToggleSave}
                    onSelect={(p) => setActiveDetailPlace(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span className="font-semibold text-slate-800">
              Women’s Nearby Directory & Safety Services
            </span>
            <span>• Verified contacts for hostels, temples, and hospitals</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="text-rose-600 font-bold hover:underline"
            >
              Emergency SOS Help
            </button>
            <button
              onClick={() => setIsAddPlaceOpen(true)}
              className="text-slate-700 font-semibold hover:underline"
            >
              List a New Place
            </button>
            <a
              href="tel:112"
              className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded"
            >
              Call 112
            </a>
          </div>
        </div>
      </footer>

      {/* Full Place Detail Dialog */}
      <PlaceDetailModal
        place={activeDetailPlace}
        onClose={() => setActiveDetailPlace(null)}
        isSaved={activeDetailPlace ? savedPlaceIds.includes(activeDetailPlace.id) : false}
        onToggleSave={handleToggleSave}
        onAddReview={handleAddReview}
      />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        userCoords={userCoords}
        places={places}
        onSelectPlace={(p) => setActiveDetailPlace(p)}
      />

      {/* Add / Submit Place Modal */}
      <AddPlaceModal
        isOpen={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onAddPlace={handleAddPlace}
        currentCity={selectedCity.name}
      />

      {/* Saved Places Drawer */}
      <SavedPlacesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlaces={savedPlacesList}
        onRemoveSaved={handleToggleSave}
        onSelectPlace={(p) => setActiveDetailPlace(p)}
      />
    </div>
  );
}
