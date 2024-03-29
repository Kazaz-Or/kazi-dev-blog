import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import { getBlogs } from '@lib/blogs';
import { PageLayout } from '@components/layouts';

import { FaPython, FaJsSquare, FaDocker, FaGit, FaLinux, FaUbuntu, FaNode } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

type Props = {
  tagCounts: [string, number][];
};

const TagsPage: NextPage<Props> = ({ tagCounts }) => {

  return (
    <PageLayout pageTitle="// All Tags of Blog Posts">
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
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
      <div className="mt-8 w-full">
      <div className="flex space-x-4 items-center justify-center">
          <FaPython size={32} style={{color: '#3776AB'}} />
          <FaJsSquare size={32} style={{color: '#F7DF1E'}} />
          <FaNode size={32} style={{color: '#539E43'}} />
          <SiTypescript size={32} style={{color: '#3178C6'}} />
          <FaDocker size={32} style={{color: '#2496ED'}} />
          <FaGit size={32} style={{color: '#F05032'}} />
          <FaLinux size={32} style={{color: '#000000'}} />
          <FaUbuntu size={32} style={{color: '#E95420'}} />
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
