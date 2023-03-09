import Head from "next/head";
import Layout from "@/components/layout";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { GetStaticProps } from "next";

import { getAllJipsPreambleData, JipId, JipPreamble } from "@/lib/jips";
import { getAuthorsFromPreamble } from "@/lib/joystream";

import styles from "@/styles/index.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const jipsPreambleData = getAllJipsPreambleData();

  const authors = await getAuthorsFromPreamble(jipsPreambleData[0].preamble);

  const props = JSON.parse(
    JSON.stringify({
      jipsPreambleData,
      authors
    })
  );

  return { props };
};

const JipItem = ({
  jipId,
  title,
  date,
  stage,
  authors
}: {
  jipId: JipId;
  title: string;
  date: string;
  stage: string;
  authors: string[];
}) => (
  <div className={styles.jip}>
    <Link className={styles.jipTitle} href={`/${jipId}`}>
      {jipId}: {title}
    </Link>
    <time className={styles.date} dateTime={date}>
      {format(parseISO(date), "LLLL d, yyyy")} ~ Stage: {stage} ~ Authors: {authors.join(", ")}
    </time>
  </div>
);

export default function Home({
  jipsPreambleData,
  authors
}: {
  jipsPreambleData: Array<{ jipId: JipId; preamble: JipPreamble }>;
  authors: string[];
}) {
  return (
    <Layout>
      <Head>
        <title>Joystream Improvement Proposal Portal</title>
        <meta
          name="description"
          content="Discover and consume JIP documents with ease using the JIP Document Portal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className={styles.landing}>
        <div className={styles.jips}>
          {jipsPreambleData.map(({ jipId, preamble: { created: date, title, stage } }) => (
            <JipItem
              key={jipId}
              jipId={jipId}
              date={date}
              title={title}
              stage={stage}
              authors={authors}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
