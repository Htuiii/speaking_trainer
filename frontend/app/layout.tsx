import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speak2Score",
  description: "Подготовка к ЕГЭ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}