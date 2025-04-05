import "./global.css";

export const metadata = {
  title: "Ai Chatbot",
  description: "the best ai chatbot in the world",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
