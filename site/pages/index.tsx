import Head from 'next/head'
import Layout from '@/components/layout'
import Link from "next/link";
import { parseISO, format } from 'date-fns';
import { GetStaticProps } from "next";

import { getAllJipsPreambleData, JipId, JipPreamble } from '@/lib/jips'

import styles from '@/styles/index.module.css'

export const getStaticProps: GetStaticProps = async () => {
  const jipsPreambleData = getAllJipsPreambleData()

  return {
    props: {
      jipsPreambleData: JSON.parse(JSON.stringify(jipsPreambleData))
    }
  };
}

export default function Home({ jipsPreambleData } : { jipsPreambleData: Array<{ jipId: JipId, preamble: JipPreamble }>}) {
  return (
    <Layout>
      <Head>
        <title>Joystream Improvement Proposal Portal</title>
        <meta name="description" content="Discover and consume JIP documents with ease using the JIP Document Portal." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className={styles.landing}>
        <div className={styles.jips}>
          {jipsPreambleData.map(({ jipId, preamble: { created: date, title } }) => (
            <div className={styles.jip} key={jipId}>
              <Link className={styles.jipTitle} href={`/${jipId}`}>{title}</Link>
              <time className={styles.date} dateTime={date}>{format(parseISO(date), 'LLLL d, yyyy')}</time>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
