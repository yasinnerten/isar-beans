import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3002"),
  title: "grabthebeans – Coffee Loyalty App",
  description: "Collect beans, earn free coffee. The loyalty app powered by Apple Wallet.",
  icons: {
    icon: "/grabthebeans-logo.png",
    apple: "/grabthebeans-logo.png",
  },
  openGraph: {
    title: "grabthebeans – Coffee Loyalty App",
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
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
