import Head from 'next/head';
import { FunctionComponent, PropsWithChildren } from 'react';

import { Footer, Navbar } from '../../common';


type Props = {
  pageTitle: string
}


const PageLayout: FunctionComponent<PropsWithChildren<Props>> = ({children, pageTitle}) => {
    return (
        <>
        <div className="page-layout pb-8 mx-auto max-w-7xl px-4 space-y-8 sm:px-6 lg:px-8">
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content="A Software development personal blog" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <div className="relative bg-white pb-8 lg:w-full lg:max-w-2xl">
            <Navbar />
          </div>
        <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl">
          { children }
        </div>
      </div>
      <Footer />
      </>
    )
}

export default PageLayout;
