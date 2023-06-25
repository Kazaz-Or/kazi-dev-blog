import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';

import { BlogList } from '../components/blogs';
import { BaseLayout } from '../components/layouts';
import { getBlogs } from '@lib/blogs';
import { saveSearchData } from '@lib/md';
import { Blog } from '@interfaces/Blog';


type Props = {
  blogs: Blog[]
}

const Home: NextPage<Props> = ({blogs}) => {
  return (
    <BaseLayout>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Newest Blog Posts
          <Link legacyBehavior href="/blogs">
            <a className='text-sm ml-1 text-indigo-600'>
              (See All)
            </a>
          </Link>
      </h2>
      <BlogList blogs={blogs}/>
      <div className="mt-8 mb-4 pt-6 px-6 pb-4 bg-white rounded-lg text-center shadow-lg border border-indigo-200">
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">
        Explore More Blog Posts
      </h2>
      <Link legacyBehavior href="/blogs">
      <a className="inline-block px-6 py-2 text-lg font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500">
        Discover all articles
      </a>
      </Link>
      </div>
      <Analytics />
    </BaseLayout>
  )
}

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogs();
  saveSearchData(blogs);

  return {
    props: {blogs: blogs.slice(0, 8)}
  }
}


export default Home;
