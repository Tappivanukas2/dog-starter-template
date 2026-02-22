import { getDogImage } from "../controllers/dogController";
import { getRandomDogImage } from "../services/dogService";

vi.mock("../services/dogService", () => ({
    getRandomDogImage: vi.fn(),
}));

describe("getDogImage", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns a dog image on success", async () => {
        const mockDogData = {
            imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
            status: "success",
        };

        vi.mocked(getRandomDogImage).mockResolvedValue(mockDogData);

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as import("express").Response;

        await getDogImage({} as import("express").Request, res);

        expect(getRandomDogImage).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledOnce();
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockDogData,
        });
    });
});
