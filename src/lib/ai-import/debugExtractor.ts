// Debug utilities for AI extraction
export const DEBUG_MODE = true; // Set to true to enable debug logs and mock mode

export function logDebug(message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`🔍 [DEBUG] ${message}`, data || '');
  }
}

export function logError(message: string, error?: any) {
  console.error(`❌ [ERROR] ${message}`, error || '');
}

export function logSuccess(message: string, data?: any) {
  console.log(`✅ [SUCCESS] ${message}`, data || '');
}

// Test function to verify the extraction flow
export function testExtraction() {
  logDebug('Testing extraction flow...');
  
  // Test file upload
  const testFile = new File(['Test content'], 'test.pdf', { type: 'application/pdf' });
  logDebug('Test file created:', {
    name: testFile.name,
    size: testFile.size,
    type: testFile.type
  });
  
  // Test API key status
  fetch('/api/test-extraction')
    .then(response => {
      logDebug('API test response status:', response.status);
      return response.json();
    })
    .then(data => {
      logDebug('API test result:', data);
    })
    .catch(error => {
      logError('API test failed:', error);
    });
}

// Force mock mode for testing
export function generateTestData() {
  logDebug('Generating test data for verification');
  
  return {
    developer: {
      name: "Test Developer Ltd",
      email: "contact@testdev.com",
      phone: "+357 25 123456",
      website: "www.testdev.com",
      description: "Test developer for debugging"
    },
    project: {
      name: "Debug Gardens",
      description: "Test project for extraction debugging",
      location: "Limassol, Cyprus",
      total_units: 127,
      status: "construction",
      amenities: ["Pool", "Gym", "Spa", "Parking"],
      completion_date: "2025-12-31"
    },
    buildings: [
      {
        name: "Building A",
        floors: 12,
        units_per_floor: 6,
        total_units: 72,
        has_elevator: true,
        has_parking: true
      },
      {
        name: "Building B", 
        floors: 10,
        units_per_floor: 5,
        total_units: 50,
        has_elevator: true,
        has_parking: true
      }
    ],
    properties: generateTestProperties()
  };
}

function generateTestProperties() {
  const properties = [];
  const buildings = ['Building A', 'Building B'];
  const types = ['studio', 'apartment', 'penthouse'];
  
  // Generate exactly 127 properties as mentioned in the issue
  for (let i = 0; i < 127; i++) {
    const building = i < 72 ? 'Building A' : 'Building B';
    const unitInBuilding = i < 72 ? i + 1 : i - 71;
    const floor = Math.floor(unitInBuilding / 6) + 1;
    const type = i < 30 ? 'studio' : i < 100 ? 'apartment' : 'penthouse';
    const bedrooms = type === 'studio' ? 0 : type === 'apartment' ? Math.floor(Math.random() * 3) + 1 : 3;
    const size = type === 'studio' ? 45 : type === 'apartment' ? 85 : 150;
    const basePrice = type === 'studio' ? 250000 : type === 'apartment' ? 350000 : 650000;
    const price = basePrice + (floor * 5000) + (Math.random() * 50000);
    
    properties.push({
      building_name: building,
      unit_number: `${building.charAt(-1)}${unitInBuilding.toString().padStart(3, '0')}`,
      floor,
      type,
      bedrooms,
      bathrooms: Math.max(1, Math.floor(bedrooms * 0.8)),
      size_m2: Math.round(size + Math.random() * 30),
      price: Math.round(price),
      view_type: Math.random() > 0.6 ? 'sea' : 'city',
      orientation: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
      has_sea_view: Math.random() > 0.7,
      is_golden_visa: price >= 300000,
      status: 'available',
      features: ['Balcony', 'AC', 'Fitted Kitchen', 'Marble Floors']
    });
  }
  
  logDebug(`Generated ${properties.length} test properties`);
  return properties;
}