import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { getBlogs } from '@lib/blogs';
import { PageLayout } from '@components/layouts';

type Props = {
  tagCounts: [string, number][];
};

const TagsPage: NextPage<Props> = ({ tagCounts }) => {
  const router = useRouter();

  return (
    <PageLayout pageTitle="// All Tags of Blog Posts">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            <span className="flex items-center">
              All Tag Categories of Blog Posts
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tagCounts.map(([tag, count]) => (
              <Link key={tag} legacyBehavior href={`tags/${tag}`}>
                <a className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white hover:shadow-md transition duration-300 block">
                  <span className="text-lg font-medium text-gray-900 hover:text-white">
                    {tag}
                  </span>
                  <div className="text-gray-500 mt-2 hover:text-white">
                    {count} {count === 1 ? 'post' : 'posts'}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-l border-gray-200 mx-8 h-full hidden sm:block" />
        <div className="ml-8 w-1/3 hidden md:block">
          <div className="relative w-full h-auto aspect-w-3 aspect-h-2">
            <Image
              src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt=""
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogs = getBlogs();
  const tagCounts = Object.entries(
    blogs.flatMap(blog => blog.tags)
      .reduce((counts: any, tag: any) => {
        counts[tag] = (counts[tag] || 0) + 1;
        return counts;
      }, {})
  ).sort((a: any, b: any) => b[1] - a[1]);

  return {
    props: { tagCounts }
  }
}

export default TagsPage;
