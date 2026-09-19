import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Map, 
  List, 
  Sparkles,
  ArrowUpDown,
  Home,
  Heart,
  Cross
} from 'lucide-react';
import { PlaceCategory } from '../types';

interface SearchBarAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (c: PlaceCategory | 'all') => void;
  categoryCounts: {
    all: number;
    hostel: number;
    temple: number;
    hospital: number;
  };
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  open24x7Only: boolean;
  onToggleOpen24x7: () => void;
  hasCctvOnly: boolean;
  onToggleHasCctv: () => void;
  sortBy: 'distance' | 'rating' | 'name';
  onSortChange: (sort: 'distance' | 'rating' | 'name') => void;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  verifiedOnly,
  onToggleVerified,
  open24x7Only,
  onToggleOpen24x7,
  hasCctvOnly,
  onToggleHasCctv,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top row: Search input & View switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, area, deity, women doctor, hostel, warden, landmark..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View toggle (List vs Map) & Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              id="view-mode-list-btn"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              id="view-mode-map-btn"
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="cat-tab-all"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <span>All Safe Places</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {categoryCounts.all}
          </span>
        </button>

        <button
          id="cat-tab-hostel"
          onClick={() => onSelectCategory('hostel')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'hostel'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Women’s Hostels & PGs</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'hostel' ? 'bg-rose-700 text-white' : 'bg-rose-200 text-rose-800'
          }`}>
            {categoryCounts.hostel}
          </span>
        </button>

        <button
          id="cat-tab-temple"
          onClick={() => onSelectCategory('temple')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'temple'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Temples & Sanctuaries</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'temple' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
          }`}>
            {categoryCounts.temple}
          </span>
        </button>

        <button
          id="cat-tab-hospital"
          onClick={() => onSelectCategory('hospital')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'hospital'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
          }`}
        >
          <Cross className="w-3.5 h-3.5" />
          <span>Hospitals & Casualty</span>
          <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'hospital' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'
          }`}>
            {categoryCounts.hospital}
          </span>
        </button>
      </div>

      {/* Safety & amenity filter chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filters:
        </span>

        <button
          id="filter-verified-toggle"
          onClick={onToggleVerified}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            verifiedOnly
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Only</span>
        </button>

        <button
          id="filter-24x7-toggle"
          onClick={onToggleOpen24x7}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            open24x7Only
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>24/7 Open</span>
        </button>

        <button
          id="filter-cctv-toggle"
          onClick={onToggleHasCctv}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            hasCctvOnly
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>CCTV & Biometric</span>
        </button>

        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 ml-auto flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
