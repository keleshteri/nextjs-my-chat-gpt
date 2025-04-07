import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Chat GPT</title>
        <meta name="description" content="A Next.js Chat GPT application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Welcome to Next.js Chat GPT</h1>
        <p className="text-xl">Your AI-powered chat application</p>
      </main>
    </>
  );
} 