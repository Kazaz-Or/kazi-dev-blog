

export interface MarkdownItem {
    title: string;
    description: string;
    date: string;
    content: string;
    slug: string;
};


export interface SearchContent extends Partial<MarkdownItem> {
    category: string;
}
