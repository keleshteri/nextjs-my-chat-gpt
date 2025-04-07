import Head from 'next/head';
import ChatWindow from '../components/chat/ChatWindow';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Chat GPT</title>
        <meta name="description" content="A Next.js Chat GPT application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Next.js Chat GPT</h1>
          <p className="text-lg md:text-xl mb-8 text-center text-gray-600">Your AI-powered chat application</p>
          
          <div className="w-full h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
            <ChatWindow isOpen={true} onClose={() => {}} />
          </div>
        </div>
      </main>
    </>
  );
} 