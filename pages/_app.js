import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import Loading from '../components/Loading';
import Head from 'next/head';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>學生證點名輔助系統</title>
        <meta property="og:title" content="學生證點名輔助系統" />
        <meta property="og:site_name" content={`學生證點名輔助系統`} />
        <meta property="og:image" content="https://rollcall.jeffery.cc/img/ntust_logo.png" />
        <meta property="og:url" content="rollcall.jeffery.cc" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"></link>
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return <Loading />;
  }

  return children;
}

App.defaultProps = {
  auth: false,
};
