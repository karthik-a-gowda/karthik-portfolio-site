import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA Accessibility Audit', () => {

  test('homepage has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target).join(', ')}`)
        .join('\n');
      console.error('Accessibility violations:\n' + summary);
    }

    expect(results.violations).toEqual([]);
  });

  test('hero section renders with required content', async ({ page }) => {
    await page.goto('/');

    // h1 heading is visible
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Karthik/);

    // Profile image has alt text
    const img = page.locator('#hero img');
    await expect(img).toBeVisible();
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(0);

    // Download Resume link exists
    const resumeLink = page.locator('a[download]');
    await expect(resumeLink).toBeVisible();

    // LinkedIn link exists and opens in new tab (scope to hero to avoid strict-mode multi-match)
    const linkedinLink = page.locator('#hero a[href*="linkedin"]');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('navigation is keyboard accessible — skip link is first focus target', async ({ page }) => {
    await page.goto('/');

    // First Tab press should land on the skip-to-content link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
  });

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/');

    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('page is responsive at 375px width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // No horizontal scroll — scrollWidth should not exceed viewport width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);

    // Hero content still visible
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

});
