import "./globals.css";

export const metadata = {
  title: "AI最強キャラクター大会",
  description: "みんなの最強キャラクターが集まる大会サイト",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
