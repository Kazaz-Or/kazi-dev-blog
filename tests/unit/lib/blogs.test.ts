import { getBlogs,
    getBlogsSlugs,
    getBlogByNameWithMarkdown,
    getBlog,
    getBlogBySlug,
    getBlogFileNames } from '../../../lib/blogs';
import { Blog } from '../../../interfaces/Blog';
import * as md from '../../../lib/md';


const mockBlogs: Blog[] = [
    {
        slug: 'test-slug-1',
        title: 'Test Title 1',
        description: 'Test Description 1',
        coverImage: 'test-coverImage-1.jpg',
        authorImage: 'test-authorImage-1.jpg',
        author: 'Test Author 1',
        date: '2023-06-10',
        tags: ['test', 'blog-1'],
        content: 'Test Content 1'
    },
    {
        slug: 'test-slug-2',
        title: 'Test Title 2',
        description: 'Test Description 2',
        coverImage: 'test-coverImage-2.jpg',
        authorImage: 'test-authorImage-2.jpg',
        author: 'Test Author 2',
        date: '2023-06-11',
        tags: ['test', 'blog-2'],
        content: 'Test Content 2'
    }
];

const BLOG_DIR = "../../../content/blogs";

jest.mock('../../../lib/md', () => {
    return {
        getAllItems: jest.fn(() => mockBlogs),
        getDir: jest.fn(() => "../../../content/blogs"),
        getFileNames: jest.fn(() => ['test-slug-1.md', 'test-slug-2.md']),
        getItemInPath: jest.fn((path: string) => {
            if (path.includes('test-slug-1.md')) return mockBlogs[0];
            if (path.includes('test-slug-2.md')) return mockBlogs[1];
        }),
        markdownToHtml: jest.fn((markdown: string) => Promise.resolve(markdown)),
    }
});

describe("BlogService", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getBlog returns a blog correctly", () => {
        const mockBlog: Blog = mockBlogs[0];
        (md.getItemInPath as jest.MockedFunction<typeof md.getItemInPath>).mockReturnValue(mockBlog);
    
        const blog = getBlog('test-slug-1.md');
        expect(blog).toEqual(mockBlog);
        expect(md.getItemInPath).toHaveBeenCalledWith(expect.stringContaining(`${BLOG_DIR}/test-slug-1.md`));
    });

    test("getBlogs returns all blogs", () => {
        (md.getAllItems as jest.MockedFunction<typeof md.getAllItems>).mockReturnValue(mockBlogs);
        const blogs = getBlogs();
        expect(blogs).toBe(mockBlogs);
        expect(md.getAllItems).toHaveBeenCalled();
    });

    test("getBlogBySlug returns a blog correctly", () => {
        const mockBlog: Blog = mockBlogs[0];
        (md.getItemInPath as jest.MockedFunction<typeof md.getItemInPath>).mockReturnValue(mockBlog);
    
        const blog = getBlogBySlug('test-slug-1');
        expect(blog).toEqual(mockBlog);
        expect(md.getItemInPath).toHaveBeenCalledWith(expect.stringContaining(`${BLOG_DIR}/test-slug-1.md`));
    });

    test("getBlogsSlugs returns all blog slugs", () => {
        (md.getFileNames as jest.MockedFunction<typeof md.getFileNames>).mockReturnValue(['test-slug-1.md', 'test-slug-2.md']);
        const slugs = getBlogsSlugs();
        expect(slugs).toEqual(['test-slug-1', 'test-slug-2']);
    });

    test("getBlogByNameWithMarkdown returns blog with markdown content converted to html", async () => {
        const mockBlog: Blog = mockBlogs[0]; // Assuming 'test-slug-1' is the slug of mockBlogs[0]
        const mockHtml = 'Test Content 1';
    
        (md.getItemInPath as jest.MockedFunction<typeof md.getItemInPath>).mockReturnValue(mockBlog);
        (md.markdownToHtml as jest.MockedFunction<typeof md.markdownToHtml>).mockReturnValue(Promise.resolve(mockHtml));
    
        const blog = await getBlogByNameWithMarkdown('test-slug-1');
        expect(blog.content).toBe(mockHtml);
        expect(md.getItemInPath).toHaveBeenCalledWith(expect.stringContaining(`${BLOG_DIR}/test-slug-1.md`));
        expect(md.markdownToHtml).toHaveBeenCalledWith(mockBlog.content);
      });

      test("getBlogFileNames returns all blog filenames", () => {
        (md.getFileNames as jest.MockedFunction<typeof md.getFileNames>).mockReturnValue(['test-slug-1.md', 'test-slug-2.md']);
    
        const filenames = getBlogFileNames();
        expect(filenames).toEqual(['test-slug-1.md', 'test-slug-2.md']);
    });
      
});