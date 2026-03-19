import { NextRequest, NextResponse } from 'next/server'

// Mock the CoffeeMachineService
const mockCoffeeMachineService = {
  getStatus: jest.fn(),
}

jest.mock('../../lib/services/coffee-machine', () => ({
  CoffeeMachineService: jest.fn(() => mockCoffeeMachineService),
}))

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}))

describe('/api/coffee-machine/status', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return machine status successfully', async () => {
      const mockStatus = {
        water: {
          current: 1.0,
          capacity: 2,
          unit: 'liters',
          percentage: 50,
        },
        coffee: {
          current: 250,
          capacity: 500,
          unit: 'grams',
          percentage: 50,
        },
        can_make: {
          espresso: true,
          double_espresso: true,
          americano: true,
        },
      }

      mockCoffeeMachineService.getStatus.mockResolvedValue(mockStatus)

      // Import the route handler after mocking
      const { GET } = require('../../app/api/coffee-machine/status/route')

      // Create a mock request
      const mockRequest = {} as NextRequest

      // Call the GET handler
      const response = await GET(mockRequest)

      // Verify NextResponse.json was called with correct data
      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status retrieved successfully',
        status: mockStatus,
      })
    })

    it('should handle service errors', async () => {
      const errorMessage = 'Database connection failed'
      mockCoffeeMachineService.getStatus.mockRejectedValue(new Error(errorMessage))

      // Import the route handler after mocking
      const { GET } = require('../../app/api/coffee-machine/status/route')

      // Create a mock request
      const mockRequest = {} as NextRequest

      // Call the GET handler
      await GET(mockRequest)

      // Verify NextResponse.json was called with error data
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          message: errorMessage,
        },
        { status: 500 }
      )
    })

    it('should handle unknown errors', async () => {
      mockCoffeeMachineService.getStatus.mockRejectedValue('Unknown error')

      // Import the route handler after mocking
      const { GET } = require('../../app/api/coffee-machine/status/route')

      // Create a mock request
      const mockRequest = {} as NextRequest

      // Call the GET handler
      await GET(mockRequest)

      // Verify NextResponse.json was called with error data
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Failed to fetch status',
        },
        { status: 500 }
      )
    })
  })
})
