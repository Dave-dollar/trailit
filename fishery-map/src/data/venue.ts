/**
 * venue.ts — Venue metadata and POI markers.
 * Positions updated to match the 1:1 reference map.
 */

export interface VenueInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  openingHours: string;
  dayTicketPrice: string;
  website?: string;
}

export interface POIDef {
  id: string;
  label: string;
  icon: "entrance" | "carpark" | "toilet" | "tackle" | "cafe" | "road";
  position: [number, number]; // [x, z]
}

export const VENUE_INFO: VenueInfo = {
  name: "Fennes Fishing",
  tagline: "Main Lake & Hobbs Croft — Bocking, Essex",
  address: "Fennes Rd, Bocking, Braintree, Essex CM7 5LX",
  phone: "01376 552131",
  openingHours: "7am – 7pm",
  dayTicketPrice: "Enquire on site",
};

export const POIS: POIDef[] = [
  // Fennes Rd labels — one north, one south (well spaced)
  { id: "fennes-n",   label: "Fennes Rd",          icon: "road",     position: [ 3, -28] },
  { id: "fennes-s",   label: "Fennes Rd",          icon: "road",     position: [-3,  20] },
  // Entrance post at the road junction
  { id: "entrance",   label: "Entrance / Access",  icon: "entrance", position: [ 0,  -1] },
  // Car park west of junction
  { id: "carpark",    label: "Car Park",            icon: "carpark",  position: [-8,   4] },
];
