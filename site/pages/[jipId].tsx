import Layout from "@/components/layout";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { parseISO, format } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { JipId }from "@/lib/files";
import { getAllJipIDs, getJipData, JipData } from "@/lib/jips";

import styles from "@/styles/jip.module.css";
import { BaseTocItem } from "@/lib/toc";

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

const TocItem = ({
  children,
  link,
  content
}: {
  children?: Array<BaseTocItem>;
} & BaseTocItem) => {
  return (
    <ul>
      <li>
        <Link href={`#${link}`}>{content}</Link>
        {children && children.length > 0
          ? children.map(item => <TocItem key={item.link} {...item} />)
          : null}
      </li>
    </ul>
  );
};

export default function JipIdComponent({ jipData }: { jipData: JipData }) {
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
          {toc.map(({ children, content, link }) => (
            <TocItem key={link} content={content} link={link}>
              {children}
            </TocItem>
          ))}
        </div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </section>
    </Layout>
  );
}
