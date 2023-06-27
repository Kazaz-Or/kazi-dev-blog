import { GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import Link from 'next/link';

import { ParsedUrlQuery } from 'querystring';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';
import { useEffect, useState } from 'react';

import { PageLayout } from '@components/layouts';
import { BlogHeader } from '@components/blogs';

import { getBlogByNameWithMarkdown, getBlogsSlugs } from '@lib/blogs';
import { Blog } from '@interfaces/Blog';

type Props = {
  blog: Blog
}

const BlogDetail: NextPage<Props> = ({blog}) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

const [showCopiedMsg, setShowCopiedMsg] = useState(false);

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href);
  setShowCopiedMsg(true);
  setTimeout(() => {
    setShowCopiedMsg(false);
  }, 1000);
};

  return (
    <>
      <PageLayout pageTitle={blog.title}>
        <div className="w-full sm:w-2/3 m-auto">
          <BlogHeader blog={blog}/>
          <article className="prose lg:prose-md markdown-image-60 custom-prose">
            <div className="mb-4"
              dangerouslySetInnerHTML={{ __html: blog.content}}/>
          </article>
          <hr/><br/>
          <div className="flex justify-between items-center mt-6">
  <Link legacyBehavior href="/tags">
    <a className="flex items-center" rel="noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
        <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
        <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/>
      </svg>
      <span className="mb=4 ml-2 text-sm text-gray-500">Tags:</span>
    </a>
  </Link>
    <button onClick={copyToClipboard} className="relative flex items-center" title="Copy to clipboard">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-6 h-6">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1"></path>
      </svg>
    <div className={`absolute top-0 mt-8 mx-4 p-1 text-xs text-white bg-black rounded ${showCopiedMsg ? 'tooltip' : 'tooltip-hidden'}`}>
      Copied to clipboard
    </div>
    </button>
    </div>
        <p className="mt-2 text-sm text-gray-500">
          {blog.tags.map(tag => (
            <Link legacyBehavior href={`/tags/${tag}`} key={tag}>
              <a className="px-2 py-1 mr-2 bg-gray-200 rounded-md">{tag}</a>
            </Link>
            ))}
        </p>
    </div>
      </PageLayout>
    </>
  )
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const { slug } = context.params!;
  const blog = await getBlogByNameWithMarkdown(slug);

  return {
    props: { blog }
  }
}


export const getStaticPaths: GetStaticPaths = () => {
  const slugs = getBlogsSlugs();
  const paths = slugs.map(slug => ({params: {slug}}));

  console.log(`paths:`, JSON.stringify(paths));
  return {
    paths,
    fallback: false
  }
}

export default BlogDetail;
