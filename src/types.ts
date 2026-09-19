export type PlaceCategory = 'hostel' | 'temple' | 'hospital';

export interface PlaceReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  safetyRating?: number;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  subCategory: string; // e.g., "Working Women's Hostel", "Devasthanam", "Multi-Speciality & Maternity"
  address: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  phoneNumbers: {
    primary: string;
    secondary?: string;
    emergencyOrWarden?: string; // Warden for hostel, Ambulance/Casualty for hospital, Priest/Trust for temple
    whatsapp?: string;
  };
  contactPerson?: string; // e.g. "Mrs. Lakshmi (Chief Warden)", "Dr. Radhika Rao (Chief Gynecologist)", "Temple Executive Officer"
  timings: string; // e.g. "Gate closes at 9:30 PM", "6:00 AM - 12:30 PM & 4:30 PM - 8:30 PM", "24/7 Open"
  isOpen24x7: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  
  // Specific hostel fields
  priceRange?: string; // e.g. "₹5,500 - ₹9,000 / mo"
  sharingTypes?: string[]; // ["1-Share", "2-Share", "3-Share"]
  curfewTime?: string; // "9:30 PM"
  
  // Specific temple fields
  presidingDeity?: string;
  specialPoojaTimings?: string;
  dressCode?: string;
  
  // Specific hospital fields
  specialities?: string[];
  hasAmbulance24x7?: boolean;
  hasBloodBank?: boolean;
  insuranceAccepted?: string[]; // e.g. ["Aarogyasri", "Ayushman Bharat", "Star Health", "All Major TPAs"]
  
  // Safety & Facilities
  safetyFeatures: string[]; // e.g. ["24/7 CCTV", "Biometric Gate", "Female Security Guard", "Strict Curfew"]
  amenities: string[]; // e.g. ["3 Times Food", "Wi-Fi", "RO Water", "Power Backup"]
  description: string;
  reviews?: PlaceReview[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityPreset {
  id: string;
  name: string;
  state: string;
  coords: Coordinates;
}
