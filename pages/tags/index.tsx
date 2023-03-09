import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Fragment } from 'react';

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
          <div className="p-6 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              <span className="flex items-center">
                All Tag Categories of Blog Posts
              </span>
            </h2>
            <div className="mt-4">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Blog Posts Categories
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Number of Blog Posts
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tagCounts.map(([tag, count]) => (
                            <Fragment key={tag}>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Link legacyBehavior href={`tags/${tag}`}>
                                    <a className="text-sm font-medium text-gray-900 hover:underline">{tag}</a>
                                  </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{count}</div>
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
