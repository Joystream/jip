import Layout from "@/components/layout";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { parseISO, format } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";

import { getAllJipIDs, getJipData, JipData, JipId } from "@/lib/jips";

import styles from "@/styles/jip.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const jipIds = getAllJipIDs();
  const paths = jipIds.map(jipId => ({ params: { jipId } }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const jipId = (params as ParsedUrlQuery).jipId as JipId;
  const jipData = await getJipData(jipId);

  return {
    props: {
      jipData: JSON.parse(JSON.stringify(jipData))
    }
  };
};

const TOC = ({ toc }: { toc: { [key: string]: Array<string> } }) => {
  return (
    <ul>
      {Object.keys(toc).map(heading1 => (
        <li key={heading1}>
          <Link href={`#${heading1}`}>{heading1}</Link>
          {toc[heading1].length > 0 ? (
            <ul>
              {toc[heading1].map(heading2 => (
                <li key={heading2}>
                  <Link href={`#${heading2}`}>{heading2}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default function JipId({ jipData }: { jipData: JipData }) {
  const { preamble, contentHtml, toc } = jipData;

  return (
    <Layout>
      <Head>
        <title>{preamble.title}</title>
      </Head>
      <section className={styles.mainSection}>
        <header className={styles.header}>
          <h1 className={styles.jipTitle}>{preamble.title}</h1>
          <time className={styles.date} dateTime={preamble.created}>
            {format(parseISO(preamble.created), "LLLL d, yyyy")}
          </time>
        </header>
        <div className={styles.toc}>
          <h1 className={styles.tocHeading}>Table of Contents</h1>
          <TOC toc={toc} />
        </div>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </Layout>
  );
}
