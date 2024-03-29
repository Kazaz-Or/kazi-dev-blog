import { useRouter } from 'next/router';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import ContentIndexer from '@lib/client/ContentIndexer';
import { SearchContent } from '@interfaces/Markdown';


const ContentSearch = () => {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [results, setResults] = useState<SearchContent[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClickOutside = () => {
    setResults([]);
    setQuery("");
    setActiveIndex(-1);
  };

  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (results.length > 0 && ref.current && !ref.current.contains(event.target as Node)) {
        handleClickOutside();
      }
    };
  
    const handleArrowKeyPress = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowUp' && results.length > 0) {
        event.preventDefault();
        setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowDown' && results.length > 0) {
        event.preventDefault();
        setActiveIndex(prevIndex => Math.min(prevIndex + 1, results.length - 1));
      }
    };
  
    const handleEnterKeyPress = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Enter' && activeIndex !== -1 && results.length > 0) {
        event.preventDefault();
        router.push(`/blogs/${results[activeIndex].slug}`);
        handleClickOutside();
      }
    };
    
    const keyboardKeyCallback = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && results.length > 0) {
        handleClickOutside();
      } else {
        handleArrowKeyPress(event);
        handleEnterKeyPress(event);
      }
    };
  
    document.addEventListener('click', callback);
    document.addEventListener('keydown', keyboardKeyCallback);
  
    return () => {
      document.removeEventListener('click', callback);
      document.removeEventListener('keydown', keyboardKeyCallback);
    };
  }, [results, activeIndex, router]);

  const performSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    const results = ContentIndexer.search(value);
    setResults(results);
    setQuery(value);
    setActiveIndex(-1);
  }

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          value={query}
          id="search-input"
          onChange={ performSearch }
          autoComplete="off"
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search"
        />
      </div>
      { results.length > 0 &&
        <ul
          className="w-80 border-solid border rounded-md z-10 bg-white max-h-80 overflow-auto absolute select is-multiple"
          role="listbox">
          {
            results.map((result, index) => (
              <li
                key={result.slug}
                onClick={() => router.push(`/blogs/${result.slug}`)}
                className={`${
                  index === activeIndex ? 'bg-indigo-600 text-white' : ''
                } hover:bg-indigo-600 hover:text-white p-3 relative cursor-pointer`}
              >
                <div className="font-bold text-sm truncate">{result.title}</div>
                <p className="truncate text-sm">{result.description}</p>
                <span className="mt-2 text-xs text-white bg-gray-800 px-2 py-1 rounded-xl">
                  {result.category}
                </span>
              </li>
            ))}
        </ul>
      }
    </>
  )
}

export default ContentSearch;
