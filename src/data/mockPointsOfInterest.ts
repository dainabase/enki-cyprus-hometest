export interface PointOfInterest {
  id: string;
  name: string;
  category: 'beach' | 'airport' | 'school' | 'hospital' | 'shopping' | 'restaurant';
  distance: number;
  duration: number;
}

export const getPointsOfInterest = (location: string): PointOfInterest[] => {
  const pointsByLocation: Record<string, PointOfInterest[]> = {
    'Limassol Marina': [
      { id: 'poi-1', name: 'Limassol Beach', category: 'beach', distance: 0.5, duration: 6 },
      { id: 'poi-2', name: 'Larnaca Airport', category: 'airport', distance: 65, duration: 45 },
      { id: 'poi-3', name: 'American Academy', category: 'school', distance: 3.2, duration: 10 },
      { id: 'poi-4', name: 'Limassol General Hospital', category: 'hospital', distance: 4.5, duration: 12 },
      { id: 'poi-5', name: 'My Mall Limassol', category: 'shopping', distance: 2.8, duration: 8 },
    ],
    'Paphos': [
      { id: 'poi-6', name: 'Coral Bay Beach', category: 'beach', distance: 8, duration: 15 },
      { id: 'poi-7', name: 'Paphos Airport', category: 'airport', distance: 12, duration: 18 },
      { id: 'poi-8', name: 'International School', category: 'school', distance: 5, duration: 12 },
      { id: 'poi-9', name: 'Paphos Hospital', category: 'hospital', distance: 6, duration: 14 },
      { id: 'poi-10', name: 'Kings Avenue Mall', category: 'shopping', distance: 3, duration: 9 },
    ],
    'Limassol Seafront': [
      { id: 'poi-11', name: 'Limassol Beach', category: 'beach', distance: 0.2, duration: 3 },
      { id: 'poi-12', name: 'Larnaca Airport', category: 'airport', distance: 68, duration: 48 },
      { id: 'poi-13', name: 'Heritage School', category: 'school', distance: 2.8, duration: 9 },
      { id: 'poi-14', name: 'Limassol General Hospital', category: 'hospital', distance: 3.5, duration: 10 },
      { id: 'poi-15', name: 'Limassol Marina Mall', category: 'shopping', distance: 1.2, duration: 5 },
    ],
    'Larnaca': [
      { id: 'poi-16', name: 'Finikoudes Beach', category: 'beach', distance: 1.5, duration: 8 },
      { id: 'poi-17', name: 'Larnaca Airport', category: 'airport', distance: 8, duration: 12 },
      { id: 'poi-18', name: 'American Academy', category: 'school', distance: 4, duration: 11 },
      { id: 'poi-19', name: 'Larnaca General Hospital', category: 'hospital', distance: 3, duration: 9 },
      { id: 'poi-20', name: 'Metropolis Mall', category: 'shopping', distance: 2.5, duration: 8 },
    ],
    'Nicosia Center': [
      { id: 'poi-21', name: 'Nearest Beach', category: 'beach', distance: 45, duration: 50 },
      { id: 'poi-22', name: 'Larnaca Airport', category: 'airport', distance: 55, duration: 45 },
      { id: 'poi-23', name: 'English School', category: 'school', distance: 2.5, duration: 8 },
      { id: 'poi-24', name: 'Nicosia General Hospital', category: 'hospital', distance: 3.8, duration: 12 },
      { id: 'poi-25', name: 'Mall of Cyprus', category: 'shopping', distance: 5, duration: 15 },
    ],
    default: [
      { id: 'poi-26', name: 'Nearest Beach', category: 'beach', distance: 2, duration: 8 },
      { id: 'poi-27', name: 'Airport', category: 'airport', distance: 45, duration: 35 },
      { id: 'poi-28', name: 'International School', category: 'school', distance: 4, duration: 10 },
      { id: 'poi-29', name: 'General Hospital', category: 'hospital', distance: 5, duration: 12 },
      { id: 'poi-30', name: 'Shopping Center', category: 'shopping', distance: 3, duration: 9 },
    ],
  };

  return pointsByLocation[location] || pointsByLocation.default;
};
