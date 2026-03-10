import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    expect: {
        timeout: 10_000,
    },
    use: {
        baseURL: "http://127.0.0.1:5173",
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: [
        {
            command: "npm --prefix server run start",
            url: "http://127.0.0.1:5000/api/health",
            reuseExistingServer: true,
            timeout: 30_000,
            env: {
                PORT: "5000",
            },
        },
        {
            command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
            url: "http://127.0.0.1:5173",
            reuseExistingServer: true,
            timeout: 30_000,
        },
    ],
});
