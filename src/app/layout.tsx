import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3002"),
  title: "grabthebeans — Collect Beans. Earn Free Coffee.",
  description: "Collect beans, earn free coffee. The loyalty app powered by Apple Wallet.",
  icons: {
    icon: "/grabthebeans-logo.png",
    apple: "/grabthebeans-logo.png",
  },
  openGraph: {
    title: "grabthebeans — Collect Beans. Earn Free Coffee.",
    description: "Collect beans, earn free coffee. The loyalty app powered by Apple Wallet.",
    images: ["/grabthebeans-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
