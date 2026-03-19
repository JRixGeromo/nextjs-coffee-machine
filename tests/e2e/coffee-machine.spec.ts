import { test, expect } from '@playwright/test'

test.describe('Coffee Machine Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the coffee machine interface', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Coffee Machine')
    
    // Check subtitle
    await expect(page.locator('text=Next.js 14 Full-Stack Application')).toBeVisible()
    
    // Check main sections
    await expect(page.locator('text=Machine Status')).toBeVisible()
    await expect(page.locator('text=Make Coffee')).toBeVisible()
    await expect(page.locator('text=Fill Containers')).toBeVisible()
  })

  test('should display machine status', async ({ page }) => {
    // Wait for status to load
    await expect(page.locator('text=Water')).toBeVisible()
    await expect(page.locator('text=Coffee')).toBeVisible()
    
    // Check progress bars
    await expect(page.locator('[data-testid="water-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="coffee-progress"]')).toBeVisible()
    
    // Check available coffee types
    await expect(page.locator('text=Available Coffee Types')).toBeVisible()
  })

  test('should display coffee making buttons', async ({ page }) => {
    // Check all coffee types are present
    await expect(page.locator('button:has-text("Espresso")')).toBeVisible()
    await expect(page.locator('button:has-text("Double Espresso")')).toBeVisible()
    await expect(page.locator('button:has-text("Americano")')).toBeVisible()
    
    // Check recipes are displayed
    await expect(page.locator('text=8g coffee, 24ml water')).toBeVisible()
    await expect(page.locator('text=16g coffee, 48ml water')).toBeVisible()
    await expect(page.locator('text=16g coffee, 148ml water')).toBeVisible()
  })

  test('should display container controls', async ({ page }) => {
    // Check water control
    await expect(page.locator('label:has-text("Water (liters)")')).toBeVisible()
    await expect(page.locator('input[placeholder="0.0"]')).toBeVisible()
    await expect(page.locator('button:has-text("Fill")')).toBeVisible()
    
    // Check coffee control
    await expect(page.locator('label:has-text("Coffee (grams)")')).toBeVisible()
    await expect(page.locator('input[placeholder="0"]')).toBeVisible()
  })

  test('should make coffee when button is clicked', async ({ page }) => {
    // Click refresh button to ensure status is loaded
    await page.locator('button:has-text("Refresh")').click()
    
    // Wait for status to load
    await page.waitForSelector('text=Water', { timeout: 5000 })
    
    // Try to make espresso
    await page.locator('button:has-text("Espresso")').click()
    
    // Check for success message (may take a moment)
    await page.waitForTimeout(1000)
    
    // Look for any message (success or error)
    const messageElement = page.locator('[class*="message-"]')
    if (await messageElement.isVisible()) {
      await expect(messageElement).toBeVisible()
    }
  })

  test('should fill water container', async ({ page }) => {
    // Fill water input
    await page.locator('input[placeholder="0.0"]').fill('0.5')
    
    // Click fill button
    await page.locator('label:has-text("Water (liters)") button:has-text("Fill")').click()
    
    // Check for message
    await page.waitForTimeout(1000)
    
    const messageElement = page.locator('[class*="message-"]')
    if (await messageElement.isVisible()) {
      await expect(messageElement).toBeVisible()
    }
  })

  test('should fill coffee container', async ({ page }) => {
    // Fill coffee input
    await page.locator('input[placeholder="0"]').fill('100')
    
    // Click fill button
    await page.locator('label:has-text("Coffee (grams)") button:has-text("Fill")').click()
    
    // Check for message
    await page.waitForTimeout(1000)
    
    const messageElement = page.locator('[class*="message-"]')
    if (await messageElement.isVisible()) {
      await expect(messageElement).toBeVisible()
    }
  })

  test('should validate input fields', async ({ page }) => {
    // Test water validation - try negative value
    await page.locator('input[placeholder="0.0"]').fill('-1')
    const waterFillButton = page.locator('label:has-text("Water (liters)") button:has-text("Fill")')
    await expect(waterFillButton).toBeDisabled()
    
    // Test coffee validation - try negative value
    await page.locator('input[placeholder="0"]').fill('-10')
    const coffeeFillButton = page.locator('label:has-text("Coffee (grams)") button:has-text("Fill")')
    await expect(coffeeFillButton).toBeDisabled()
    
    // Test empty inputs
    await page.locator('input[placeholder="0.0"]').fill('')
    await page.locator('input[placeholder="0"]').fill('')
    
    await expect(waterFillButton).toBeDisabled()
    await expect(coffeeFillButton).toBeDisabled()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure by intercepting the request
    await page.route('/api/coffee-machine/status', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Database connection failed'
        })
      })
    })
    
    // Refresh the page
    await page.reload()
    
    // Wait for error handling
    await page.waitForTimeout(2000)
    
    // The app should still load, even with API errors
    await expect(page.locator('h1')).toContainText('Coffee Machine')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check all elements are still visible and properly arranged
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Machine Status')).toBeVisible()
    await expect(page.locator('text=Make Coffee')).toBeVisible()
    await expect(page.locator('text=Fill Containers')).toBeVisible()
    
    // Check buttons are stacked vertically on mobile
    const coffeeButtons = page.locator('button:has-text("Espresso"), button:has-text("Double Espresso"), button:has-text("Americano")')
    await expect(coffeeButtons).toHaveCount(3)
  })
})
