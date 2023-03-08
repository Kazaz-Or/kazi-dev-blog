import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Blog } from '@interfaces/Blog';
import { getBlogs } from '@lib/blogs';
import { PageLayout } from '@components/layouts';
import { BlogList } from '@components/blogs';

type Props = {
  blogs: Blog[];
  tag: string;
}

const TagPage: NextPage<Props> = ({ blogs, tag }) => {
  return (
    <PageLayout pageTitle={`// Tag: ${tag}`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        All Blog Posts in the {tag} Category
      </h2>
      <BlogList blogs={blogs} />
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = getBlogs();
  const tags = [...new Set(blogs.flatMap(blog => blog.tags))];
  const paths = tags.map(tag => ({ params: { tag } }));

  return {
    paths,
    fallback: false
  };
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const blogs = getBlogs().filter(blog => blog.tags.includes(params?.tag as string));
  const tag = params?.tag as string;

  return {
    props: { blogs, tag }
  };
}

export default TagPage;
