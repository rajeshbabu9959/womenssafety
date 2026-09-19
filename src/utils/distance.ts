import { Coordinates } from '../types';

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats a distance in kilometers to a friendly human readable string.
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Generates Google Maps navigation URL
 */
export function getDirectionsUrl(lat: number, lng: number, placeName?: string): string {
  if (placeName) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}+${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Cleans phone number for tel: link
 */
export function formatTelLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

/**
 * Generates WhatsApp chat link
 */
export function getWhatsAppUrl(phone: string, text?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // Default to 91 country code if 10 digits
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${fullPhone}${message}`;
}
