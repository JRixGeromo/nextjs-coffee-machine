const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Initializing database...');

  try {
    // Create initial coffee machine state
    const state = await prisma.coffeeMachineState.upsert({
      where: { id: 1 },
      update: {},
      create: {
        waterMl: 1000, // 1 liter
        coffeeGrams: 250, // 250 grams
      },
    });

    console.log('✅ Coffee machine state created:', state);

    // Create coffee recipes
    const recipes = [
      {
        key: 'espresso',
        name: 'Espresso',
        coffeeGrams: 8,
        waterMilliliters: 24,
        description: 'A concentrated coffee shot with rich flavor',
      },
      {
        key: 'double_espresso',
        name: 'Double Espresso',
        coffeeGrams: 16,
        waterMilliliters: 48,
        description: 'Two shots of espresso for a stronger flavor',
      },
      {
        key: 'americano',
        name: 'Americano',
        coffeeGrams: 16,
        waterMilliliters: 148,
        description: 'Espresso diluted with hot water for a milder taste',
      },
    ];

    for (const recipe of recipes) {
      await prisma.coffeeRecipe.upsert({
        where: { key: recipe.key },
        update: recipe,
        create: recipe,
      });
    }

    console.log('✅ Coffee recipes created');

    console.log('🎉 Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
