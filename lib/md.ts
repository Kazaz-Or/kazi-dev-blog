import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

import { MarkdownItem } from '@interfaces/Markdown';


const getDir = (path: string) => join(process.cwd(), path);

const getFileNames = (dir: string): string[] => {
    console.log("Getting file names...");
    return fs.readdirSync(dir);
}

const getItemInPath = (filePath: string): MarkdownItem => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    console.log("Extracting blog content and metadata object...");
    return { ...data, content } as MarkdownItem;
}


const getAllItems = (fileNames: string[], get: (name: string) => MarkdownItem) => {
    const items = fileNames.map((name) => get(name));
    console.log("Getting all items...");
    return items;
}


const markdownToHtml = async (markdown: string) => {
    const result = await remark()
    .use(html)
    .use(remarkGfm)
    .process(markdown);

    console.log("Converting markdown to HTML...");
    return result.toString();
}

export {
    getDir,
    getFileNames,
    getItemInPath,
    getAllItems,
    markdownToHtml
};
