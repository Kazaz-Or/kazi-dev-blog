import { getLocalSearchIndex, shortify } from "../../../../lib/client/utils";


jest.mock('@content/search/index.json', () => ([
    { slug: 'test-slug', title: 'Test Title', description: 'Test Description', category: 'Test Category' }
]), { virtual: true });


describe("Utils", () => {
    describe("getLocalSearchIndex", () => {
        test("should return the search index", () => {
            const index = getLocalSearchIndex();
            expect(index).toEqual([
                { slug: 'test-slug', title: 'Test Title', description: 'Test Description', category: 'Test Category' }
            ]);
        });
    });

    describe("shortify", () => {
        test("should return the original text if it is shorter than maxLength", () => {
            const text = "short text";
            expect(shortify(text)).toBe("short text");
        });

        test("should return the text cut off at maxLength with an ellipsis if it is longer than maxLength", () => {
            const text = "a very very long text that will surely exceed the maximum length of forty characters";
            const shortenedText = shortify(text, 40);
            expect(shortenedText.length).toBe(44);
            expect(shortenedText.slice(-3)).toBe("...");
        });
    });
});
