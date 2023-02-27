import {  GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import { ParsedUrlQuery } from 'querystring';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';
import { useEffect } from 'react';

import { PageLayout } from '@components/layouts';
import { BlogHeader } from '@components/blogs';

import { getBlogByNameWithMarkdown, getBlogsSlugs } from '@lib/blogs';
import { Blog } from '@interfaces/Blog';

type Props = {
  blog: Blog
}

const BlogDetail: NextPage<Props> = ({blog}) => {
  useEffect(() => {
    hljs.initHighlighting();
  }, []);

  return (
    <>
      <PageLayout pageTitle={blog.title}>
        <div className="w-2/3 m-auto">
          <BlogHeader blog={blog}/>
          <article className="prose lg:prose-md markdown-image-50">
            <div className="mb-4"
              dangerouslySetInnerHTML={{ __html: blog.content}}
            />
          </article>
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
