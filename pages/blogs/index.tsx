import { GetStaticProps, NextPage } from 'next';

import { Blog } from '@interfaces/Blog';
import { getBlogs } from '@lib/blogs';
import { PageLayout } from '@components/layouts';
import { BlogList } from '@components/blogs';


type Props = {
    blogs: Blog[];
}


const BlogsPage:NextPage<Props> = ({blogs}) => {

    return (
        <PageLayout pageTitle="// All Blog Posts">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            All Blog Posts
            </h2>
            <BlogList blogs={blogs} />
        </PageLayout>
    )
}

export const getStaticProps: GetStaticProps = () => {
    const blogs = getBlogs();
  
    return {
      props: {blogs}
    }
  }
  
export default BlogsPage;
