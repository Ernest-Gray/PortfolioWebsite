import { test, expect } from '@playwright/test'

test.describe('Portfolio site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Ernest Gray/)
  })

  test('Hero section renders name and tagline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Ernest Gray/i })).toBeVisible()
  })

  test('Navbar shows brand name', async ({ page }) => {
    await expect(page.getByRole('navigation').getByText('Ernest Gray')).toBeVisible()
  })

  test('Experience dropdown opens and lists jobs', async ({ page }) => {
    const expBtn = page.getByTestId('nav-experience-btn')
    await expBtn.click()
    const dropdown = page.getByTestId('nav-dropdown')
    await expect(dropdown).toBeVisible()
    await expect(dropdown.getByText('Amazon Web Services')).toBeVisible()
    await expect(dropdown.getByText('Northrop Grumman')).toBeVisible()
  })

  test('Experience dropdown navigates to job anchor', async ({ page }) => {
    await page.getByTestId('nav-experience-btn').click()
    await page.getByTestId('nav-dropdown').getByText('Northrop Grumman').click()
    // dropdown closes
    await expect(page.getByTestId('nav-dropdown')).not.toBeVisible()
  })

  test('About section is visible on scroll', async ({ page }) => {
    await page.getByText('About', { exact: true }).first().click()
    await expect(page.locator('#about')).toBeVisible()
  })

  test('Skills section rendered', async ({ page }) => {
    const skillsSection = page.locator('#skills')
    await skillsSection.scrollIntoViewIfNeeded()
    await expect(skillsSection).toBeVisible()
    await expect(skillsSection.getByText('Python').first()).toBeVisible()
  })

  test('Timeline shows first job expanded by default', async ({ page }) => {
    const experienceSection = page.locator('#experience')
    await experienceSection.scrollIntoViewIfNeeded()
    await expect(page.locator('#aws')).toBeVisible()
  })

  test('Timeline card expands on click', async ({ page }) => {
    const experienceSection = page.locator('#experience')
    await experienceSection.scrollIntoViewIfNeeded()
    // click Northrop card button
    await page.locator('#northrop button').first().click()
    await expect(page.getByText(/\$29M Northrop Grumman contract/)).toBeVisible()
  })

  test('Projects section renders', async ({ page }) => {
    const projectsSection = page.locator('#projects')
    await projectsSection.scrollIntoViewIfNeeded()
    await expect(page.getByText('LISA — LLM Inference Platform')).toBeVisible()
  })

  test('Chat toggle button is visible', async ({ page }) => {
    await expect(page.getByTestId('chat-toggle')).toBeVisible()
  })

  test('Chat panel opens on toggle click', async ({ page }) => {
    await page.getByTestId('chat-toggle').click()
    // chat panel or modal should appear — look for input
    await expect(page.getByPlaceholder(/ask a question/i).first()).toBeVisible()
  })

  test('Chat panel closes on second click', async ({ page }) => {
    await page.getByTestId('chat-toggle').click()
    await expect(page.getByPlaceholder(/ask a question/i).first()).toBeVisible()
    await page.getByTestId('chat-toggle').click()
    await expect(page.getByPlaceholder(/ask a question/i).first()).not.toBeVisible()
  })

  test('Footer renders copyright and links', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByText(/2026/)).toBeVisible()
  })
})
