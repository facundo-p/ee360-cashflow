// API Configuration
// Controls whether to use the real backend API or the mock implementation

// Environment variable to toggle between mock and real API
// Set NEXT_PUBLIC_USE_MOCK_API=true to use mock, false or undefined to use real API
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Export flag for checking current mode
export const isUsingMockApi = USE_MOCK_API;

// Get appropriate API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
