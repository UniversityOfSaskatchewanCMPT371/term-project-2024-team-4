const { test, expect } = require("@playwright/test");

test.describe("Add New Projectile Components Test", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page where the artifact details are displayed
    await page.goto("http://localhost:8080/addNewProjectile");
  });

  test("check if needed components exists", async ({ page }) => {
    // Check for Period and Culture dropdowns
    await expect(page.locator("text=Period")).toBeVisible();
    await expect(page.locator('select[name="period"]')).toBeVisible();
    await expect(page.locator("text=Culture")).toBeVisible();
    await expect(page.locator('select[name="culture"]')).toBeVisible();
    // Check for Materials input field
    await expect(page.locator("text=Materials")).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
    // Check for Dimensions fields
    await expect(page.locator("text=Dimensions")).toBeVisible();
    await expect(page.locator('input[name="length"]')).toBeVisible();
    await expect(page.locator('input[name="width"]')).toBeVisible();
    await expect(page.locator('input[name="height"]')).toBeVisible();

    // Check for Location (Coordinates) fields
    await expect(page.locator("text=Location (Coordinates)")).toBeVisible();
    await expect(page.locator('input[name="longitude"]')).toBeVisible();
    await expect(page.locator('input[name="latitude"]')).toBeVisible();

    // Check for Description field
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
  });
});
