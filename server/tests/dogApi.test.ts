/// <reference types="vitest/globals" />

import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

vi.mock("../services/dogService", () => ({
    getRandomDogImage: vi.fn(),
}));

describe("GET /api/dogs/random", () => {
    let server: Server;
    let baseUrl: string;

    beforeAll(async () => {
        const { default: app } = await import("../index");

        server = createServer(app);
        await new Promise<void>((resolve) => {
            server.listen(0, "127.0.0.1", () => resolve());
        });

        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns 200 with success true and data.imageUrl string", async () => {
        const { getRandomDogImage } = await import("../services/dogService");

        vi.mocked(getRandomDogImage).mockResolvedValue({
            imageUrl:
                "https://images.dog.ceo/breeds/sheepdog-indian/Himalayan_Sheepdog.jpg",
            status: "success",
        });

        const response = await fetch(`${baseUrl}/api/dogs/random`, {
            method: "GET",
        });

        expect(response.status).toBe(200);

        const body = (await response.json()) as unknown as {
            success: boolean;
            data?: { imageUrl?: unknown };
        };

        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data?.imageUrl).toBeDefined();
        expect(typeof body.data?.imageUrl).toBe("string");
    });

    it("returns 404 with correct error message for invalid route", async () => {
        const response = await fetch(`${baseUrl}/api/dogs/invalid`, {
            method: "GET",
        });

        expect(response.status).toBe(404);

        const body = (await response.json()) as unknown as {
            success?: unknown;
            error?: unknown;
        };

        expect(body.error).toBeDefined();
        expect(typeof body.error).toBe("string");
        expect(body.error).toBe("Route not found");
    });
});
