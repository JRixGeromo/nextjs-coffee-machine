import { CoffeeMachineService } from '../../lib/services/coffee-machine';
import { Recipe } from '../../lib/Recipe';

// Mock Prisma Client
const mockPrismaClient = {
  coffeeMachineState: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('CoffeeMachineService', () => {
  let service: CoffeeMachineService;

  beforeEach(() => {
    service = new CoffeeMachineService();
    jest.clearAllMocks();
  });

  describe('getStatus', () => {
    it('should return machine status with existing state', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      const status = await service.getStatus();

      expect(status).toEqual({
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
      });
    });

    it('should create initial state when none exists', async () => {
      const mockNewState = {
        id: 1,
        waterMl: 0,
        coffeeGrams: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockNewState);
      
      mockPrismaClient.coffeeMachineState.create.mockResolvedValue(mockNewState);

      const status = await service.getStatus();

      expect(mockPrismaClient.coffeeMachineState.create).toHaveBeenCalledWith({
        data: {
          waterMl: 0,
          coffeeGrams: 0,
        },
      });

      expect(status.water.percentage).toBe(0);
      expect(status.coffee.percentage).toBe(0);
    });

    it('should calculate can_make correctly', async () => {
      const mockState = {
        id: 1,
        waterMl: 100, // Not enough for americano (needs 148ml)
        coffeeGrams: 16, // Enough for espresso and americano, not double espresso (needs 16g)
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      const status = await service.getStatus();

      expect(status.can_make).toEqual({
        espresso: false, // Not enough water (needs 24ml)
        double_espresso: false, // Not enough water (needs 48ml)
        americano: false, // Not enough water (needs 148ml)
      });
    });
  });

  describe('makeCoffee', () => {
    it('should make espresso successfully', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedState = {
        id: 1,
        waterMl: 976, // 1000 - 24
        coffeeGrams: 242, // 250 - 8
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);
      mockPrismaClient.coffeeMachineState.update.mockResolvedValue(mockUpdatedState);

      const result = await service.makeCoffee('espresso');

      expect(result).toBe('Espresso made successfully!');
      expect(mockPrismaClient.coffeeMachineState.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          waterMl: 976,
          coffeeGrams: 242,
        },
      });
    });

    it('should throw error for unknown coffee type', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.makeCoffee('unknown')).rejects.toThrow('Unknown coffee type: unknown');
    });

    it('should throw error when not enough coffee', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 5, // Not enough for espresso (needs 8g)
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.makeCoffee('espresso')).rejects.toThrow(
        'Not enough coffee to make Espresso. Need 3g more, but only 5g available.'
      );
    });

    it('should throw error when not enough water', async () => {
      const mockState = {
        id: 1,
        waterMl: 20, // Not enough for espresso (needs 24ml)
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.makeCoffee('espresso')).rejects.toThrow(
        'Not enough water to make Espresso. Need 4ml more, but only 20ml available.'
      );
    });

    it('should throw error when both resources insufficient', async () => {
      const mockState = {
        id: 1,
        waterMl: 20, // Not enough for espresso (needs 24ml)
        coffeeGrams: 5, // Not enough for espresso (needs 8g)
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.makeCoffee('espresso')).rejects.toThrow(
        'Not enough resources. Need 3g more coffee and 4ml more water.'
      );
    });
  });

  describe('fillWater', () => {
    it('should fill water successfully', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedState = {
        id: 1,
        waterMl: 1500, // 1000 + 500
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);
      mockPrismaClient.coffeeMachineState.update.mockResolvedValue(mockUpdatedState);

      const result = await service.fillWater(0.5);

      expect(result).toBe('Water container filled with 0.5 liters.');
      expect(mockPrismaClient.coffeeMachineState.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { waterMl: 1500 },
      });
    });

    it('should throw error for negative quantity', async () => {
      await expect(service.fillWater(-1)).rejects.toThrow('Water quantity must be positive');
    });

    it('should throw error for zero quantity', async () => {
      await expect(service.fillWater(0)).rejects.toThrow('Water quantity must be positive');
    });

    it('should throw error when container would overflow', async () => {
      const mockState = {
        id: 1,
        waterMl: 1500,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.fillWater(1)).rejects.toThrow(
        'Cannot add 1 liters. The water container would overflow (max 2 liters).'
      );
    });
  });

  describe('fillCoffee', () => {
    it('should fill coffee successfully', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 350, // 250 + 100
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);
      mockPrismaClient.coffeeMachineState.update.mockResolvedValue(mockUpdatedState);

      const result = await service.fillCoffee(100);

      expect(result).toBe('Coffee container filled with 100 grams.');
      expect(mockPrismaClient.coffeeMachineState.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { coffeeGrams: 350 },
      });
    });

    it('should throw error for negative quantity', async () => {
      await expect(service.fillCoffee(-10)).rejects.toThrow('Coffee quantity must be positive');
    });

    it('should throw error for zero quantity', async () => {
      await expect(service.fillCoffee(0)).rejects.toThrow('Coffee quantity must be positive');
    });

    it('should throw error when container would overflow', async () => {
      const mockState = {
        id: 1,
        waterMl: 1000,
        coffeeGrams: 400,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.coffeeMachineState.findFirst.mockResolvedValue(mockState);

      await expect(service.fillCoffee(150)).rejects.toThrow(
        'Cannot add 150 grams. The coffee container would overflow (max 500 grams).'
      );
    });
  });

  describe('Recipe Management', () => {
    it('should return all recipes', () => {
      const recipes = service.getAllRecipes();

      expect(recipes).toHaveLength(3);
      expect(recipes[0]).toBeInstanceOf(Recipe);
      expect(recipes[0].key).toBe('espresso');
      expect(recipes[1].key).toBe('double_espresso');
      expect(recipes[2].key).toBe('americano');
    });

    it('should check if recipe exists', () => {
      expect(service.hasRecipe('espresso')).toBe(true);
      expect(service.hasRecipe('unknown')).toBe(false);
    });

    it('should get specific recipe', () => {
      const espresso = service.getRecipe('espresso');
      expect(espresso).toBeInstanceOf(Recipe);
      expect(espresso?.name).toBe('Espresso');

      const unknown = service.getRecipe('unknown');
      expect(unknown).toBeUndefined();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from database', async () => {
      await service.disconnect();

      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });
  });
});
