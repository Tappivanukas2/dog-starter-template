import { test, expect } from "@playwright/test";

test("dog image is retrieved on page load", async ({ page }) => {
    const dogApiResponsePromise = page.waitForResponse((response) => {
        const url = response.url();
        return url.includes("/api/dogs/random") && response.status() === 200;
    });

    await page.goto("/");

    const dogApiResponse = await dogApiResponsePromise;
    expect(dogApiResponse.ok()).toBe(true);

    const dogImage = page.locator("img.dog-image");
    await expect(dogImage).toBeVisible();
    await expect(dogImage).toHaveAttribute("src", /^https:\/\//);
});

test("dog image is retrieved when button is clicked", async ({ page }) => {
    await page.goto("/");

    const button = page.getByRole("button", { name: /get another dog/i });
    await expect(button).toBeEnabled();

    const dogApiResponsePromise = page.waitForResponse((response) => {
        const url = response.url();
        return url.includes("/api/dogs/random") && response.status() === 200;
    });

    await button.click();

    const dogApiResponse = await dogApiResponsePromise;
    expect(dogApiResponse.ok()).toBe(true);

    const dogImage = page.locator("img.dog-image");
    await expect(dogImage).toBeVisible();
    await expect(dogImage).toHaveAttribute("src", /^https:\/\//);
});

test("shows error when API call fails", async ({ page }) => {
    await page.route("**/api/dogs/random", async (route) => {
        await route.abort();
    });

    await page.goto("/");

    const errorElement = page.getByText(/error/i);
    await expect(errorElement).toBeVisible();
});
