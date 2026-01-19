import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Bodega Research | Web3 Due Diligence",
  description:
    "Professional Web3 project analysis and due diligence. Get the alpha before you ape.",
  keywords: ["web3", "crypto", "due diligence", "research", "defi", "nft"],
  authors: [{ name: "Bodega Research" }],
  openGraph: {
    title: "Bodega Research | Web3 Due Diligence",
    description:
      "Professional Web3 project analysis and due diligence. Get the alpha before you ape.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bodega Research | Web3 Due Diligence",
    description:
      "Professional Web3 project analysis and due diligence. Get the alpha before you ape.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased bg-surface-primary text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
