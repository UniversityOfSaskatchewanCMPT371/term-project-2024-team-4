// @ts-check
const { test, expect } = require('@playwright/test');
/**
 * This file will host our smoke tests to ensure that
 * the main functionality of the system works.
 * Main Functionality is based off our Features (Requirements Specs)
 */

test('has title', async ({ page }) => {
    await page.goto('http://localhost:8080');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Vite + React/);
  });

/*
Admin Login
    - Invalid Credentials: cannot login
        - Test admin-only endpoint before login
    - Valid Credentials: can log in
        - Test admin-only endpoint after login
*/

/*
Catalog Management
    - Can add new artifact
    - Can modify the artifact
    - Can delete the artifact
*/

/*
Import/Export
*/

/*
Data Aggregation
*/

/*
Search/Filter
*/