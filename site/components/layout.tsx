import Head from "next/head";
import React from "react";
import Link from "next/link";

import styles from "@/styles/layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/joystream-icon.png" />
        <meta name="og:title" content="Joystream Improvement Proposal Portal" />
      </Head>
      <header className={styles.header}>
        <Link href="/" className={styles.heading}>
          Joystream Improvement Proposal Portal
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}
