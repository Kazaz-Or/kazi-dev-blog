/* eslint-disable react/no-children-prop */
import { GetStaticProps, NextPage } from "next";

import { PageLayout } from "@components/layouts";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";


const PortfolioPage: NextPage = () => {
const [content, setContent] = useState("");

useEffect(() => {
    fetch("aboutme.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
        <PageLayout pageTitle="About Me">
        <div className="w-2/3 m-auto">
        <article className="prose lg:prose-md">
        <div className="mb-44">
        <ReactMarkdown children={content} />
        </div>
        </article>
        </div>
        </PageLayout>
    </>
  )
}



export default PortfolioPage;
