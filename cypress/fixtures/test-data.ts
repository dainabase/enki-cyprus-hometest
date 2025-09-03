// Fixtures for testing
export const testImage1 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

export const mockUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
}

export const mockAdmin = {
  email: 'admin@enki-realty.com',
  password: 'AdminPassword123!',
  name: 'Admin User'
}

export const mockProject = {
  title: 'Test Luxury Villa',
  description: 'Beautiful luxury villa with sea view in Limassol, Cyprus',
  price: 850000,
  type: 'villa',
  location: {
    city: 'Limassol',
    country: 'Cyprus',
    coordinates: [34.6851, 33.0430]
  },
  features: ['Sea view', 'Private pool', 'Garden', '4 bedrooms'],
  photos: [testImage1]
}