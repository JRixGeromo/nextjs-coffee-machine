import { Recipe } from '../lib/Recipe';

describe('Recipe Value Object', () => {
  describe('Constructor', () => {
    it('should create a valid recipe', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24, 'A concentrated shot');
      
      expect(recipe.key).toBe('espresso');
      expect(recipe.name).toBe('Espresso');
      expect(recipe.coffeeGrams).toBe(8);
      expect(recipe.waterMilliliters).toBe(24);
      expect(recipe.description).toBe('A concentrated shot');
    });

    it('should create a recipe without description', () => {
      const recipe = new Recipe('americano', 'Americano', 16, 148);
      
      expect(recipe.key).toBe('americano');
      expect(recipe.name).toBe('Americano');
      expect(recipe.coffeeGrams).toBe(16);
      expect(recipe.waterMilliliters).toBe(148);
      expect(recipe.description).toBeUndefined();
    });

    it('should throw error for empty key', () => {
      expect(() => {
        new Recipe('', 'Espresso', 8, 24);
      }).toThrow('Recipe key cannot be empty');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new Recipe('espresso', '', 8, 24);
      }).toThrow('Recipe name cannot be empty');
    });

    it('should throw error for negative coffee grams', () => {
      expect(() => {
        new Recipe('espresso', 'Espresso', -8, 24);
      }).toThrow('Coffee grams must be positive');
    });

    it('should throw error for zero coffee grams', () => {
      expect(() => {
        new Recipe('espresso', 'Espresso', 0, 24);
      }).toThrow('Coffee grams must be positive');
    });

    it('should throw error for negative water milliliters', () => {
      expect(() => {
        new Recipe('espresso', 'Espresso', 8, -24);
      }).toThrow('Water milliliters must be positive');
    });

    it('should throw error for zero water milliliters', () => {
      expect(() => {
        new Recipe('espresso', 'Espresso', 8, 0);
      }).toThrow('Water milliliters must be positive');
    });
  });

  describe('canMake', () => {
    it('should return true when resources are sufficient', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.canMake(100, 50)).toBe(true);
    });

    it('should return false when water is insufficient', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.canMake(20, 50)).toBe(false);
    });

    it('should return false when coffee is insufficient', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.canMake(100, 5)).toBe(false);
    });

    it('should return false when both resources are insufficient', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.canMake(20, 5)).toBe(false);
    });

    it('should return true when resources exactly match requirements', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.canMake(24, 8)).toBe(true);
    });
  });

  describe('getCoffeeGrams', () => {
    it('should return the coffee grams', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.getCoffeeGrams()).toBe(8);
    });
  });

  describe('getWaterMilliliters', () => {
    it('should return the water milliliters', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24);
      
      expect(recipe.getWaterMilliliters()).toBe(24);
    });
  });

  describe('toJSON', () => {
    it('should convert to plain object', () => {
      const recipe = new Recipe('espresso', 'Espresso', 8, 24, 'A concentrated shot');
      
      const json = recipe.toJSON();
      
      expect(json).toEqual({
        key: 'espresso',
        name: 'Espresso',
        coffeeGrams: 8,
        waterMilliliters: 24,
        description: 'A concentrated shot',
      });
    });

    it('should convert to plain object without description', () => {
      const recipe = new Recipe('americano', 'Americano', 16, 148);
      
      const json = recipe.toJSON();
      
      expect(json).toEqual({
        key: 'americano',
        name: 'Americano',
        coffeeGrams: 16,
        waterMilliliters: 148,
        description: undefined,
      });
    });
  });

  describe('fromJSON', () => {
    it('should create Recipe from plain object', () => {
      const data = {
        key: 'espresso',
        name: 'Espresso',
        coffeeGrams: 8,
        waterMilliliters: 24,
        description: 'A concentrated shot',
      };
      
      const recipe = Recipe.fromJSON(data);
      
      expect(recipe.key).toBe('espresso');
      expect(recipe.name).toBe('Espresso');
      expect(recipe.coffeeGrams).toBe(8);
      expect(recipe.waterMilliliters).toBe(24);
      expect(recipe.description).toBe('A concentrated shot');
    });

    it('should create Recipe from plain object without description', () => {
      const data = {
        key: 'americano',
        name: 'Americano',
        coffeeGrams: 16,
        waterMilliliters: 148,
      };
      
      const recipe = Recipe.fromJSON(data);
      
      expect(recipe.key).toBe('americano');
      expect(recipe.name).toBe('Americano');
      expect(recipe.coffeeGrams).toBe(16);
      expect(recipe.waterMilliliters).toBe(148);
      expect(recipe.description).toBeUndefined();
    });
  });
});
