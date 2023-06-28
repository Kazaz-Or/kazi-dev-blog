import { useState } from 'react';
import { BlogList } from '@components/blogs';
import { Blog } from '@interfaces/Blog';


const RelatedBlogs: React.FC<{blogs: Blog[]}> = ({ blogs }) => {
  const [startIndex, setStartIndex] = useState(0);
  
  const handleScroll = (direction: 'next' | 'prev') => {
    if(direction === 'next') {
      setStartIndex(prevIndex => Math.min(prevIndex + 4, blogs.length - 4));
    } else {
      setStartIndex(prevIndex => Math.max(prevIndex - 4, 0));
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={() => handleScroll('prev')} className="self-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div className="flex-grow">
      <BlogList blogs={blogs.slice(startIndex, startIndex + 4)} showDescription={false} />
      </div>
      <button onClick={() => handleScroll('next')} className="self-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
};

export default RelatedBlogs;
