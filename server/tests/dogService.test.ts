import { getRandomDogImage } from "../services/dogService";

describe("getRandomDogImage", () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
        globalThis.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it("maps Dog API message -> imageUrl and returns success", async () => {
        const data = {
            message: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
            status: "success",
        };

        const fetchMock = vi.fn(
            async () =>
                ({
                    ok: true,
                    status: 200,
                    json: async () => data,
                }) as unknown as Response,
        );

        globalThis.fetch = fetchMock as unknown as typeof fetch;

        const result = await getRandomDogImage();

        const expectedReturn = {
            imageUrl: data.message,
            status: "success",
        };

        expect(result).toEqual(expectedReturn);
        expect(fetchMock).toHaveBeenCalledOnce();
        return result;
    });

    it("returns error status 500 and message when API response is not ok", async () => {
        const fetchMock = vi.fn(
            async () =>
                ({
                    ok: false,
                    status: 500,
                    json: async () => ({ message: "Internal Server Error" }),
                }) as unknown as Response,
        );

        globalThis.fetch = fetchMock as unknown as typeof fetch;

        try {
            await getRandomDogImage();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            console.error(error);
        }
        expect(fetchMock).toHaveBeenCalledOnce();
    });
});
