import { join } from 'path';

import { Blog } from '@interfaces/Blog';
import { getAllItems, getDir, getFileNames, getItemInPath, markdownToHtml } from './md';


const BLOG_DIR = getDir("/content/blogs");

const getBlogFileNames = () => {
    console.log("Getting file blog names...");
    return getFileNames(BLOG_DIR);
}

const getBlogsSlugs = () => {
    console.log("Getting blog slugs...");
    return getBlogFileNames().map(fileName => fileName.replace(/\.md$/, ""));
}

const getBlog = (fileName: string): Blog => {
    const blog = getItemInPath(join(BLOG_DIR, fileName)) as Blog;
    blog.slug = fileName.replace(/\.md$/, "");
    console.log("Getting blog");
    return blog;
}

const getBlogBySlug = (slug: string) => {
    const fileName = slug + ".md";
    console.log("Getting blog by slug...");
    return getBlog(fileName);
}

const getBlogByNameWithMarkdown = async (slug: string): Promise<Blog> => {
    const blog = getBlogBySlug(slug);
    blog.content = await markdownToHtml(blog.content);
    console.log("Returning html'd markdown blogs");
    return blog;
}


const getBlogs = (): Blog[] => {
    const names = getBlogFileNames();
    console.log("Returning all blogs");
    return getAllItems(names, getBlog) as Blog[];
}


export {
    getBlogs,
    getBlogsSlugs,
    getBlogByNameWithMarkdown,
    getBlog,
    getBlogBySlug,
    getBlogFileNames
};
