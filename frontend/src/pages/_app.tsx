import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function WordGridApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WordGrid</title>
        <meta name="description" content="WordGrid - multiplayer 4x4 word strategy game" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
