import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Streamer",
  description: "Stream movies and TV shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
