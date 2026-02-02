import type { Metadata } from "next";
import { Nabla, Poppins, Righteous } from "next/font/google";
import "./globals.css";
import BackToTop from "./components/back-to-top";

const nabla = Nabla({
  variable: "--font-nabla",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unyul-yt.vercel.app"), // Ganti dengan domain asli saat deploy
  title: {
    default: "Unyul - Streamer & DJ Magang",
    template: "%s | Unyul",
  },
  description:
    "Selamat datang di website resmi Unyul. Saksikan aksi gaming seru, live stream, dan DJ set (walau masih magang) dari Unyul. Update jadwal dan konten terbaru di sini!",
  keywords: [
    "Unyul",
    "Unyul Streamer",
    "Unyul YouTube",
    "Gamer Indonesia",
    "DJ Magang",
    "Live Streamer",
    "Content Creator",
    "Main Game",
  ],
  authors: [{ name: "Unyul" }],
  creator: "Unyul",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Unyul - Streamer & DJ Magang",
    description: "Si Unyul, Streamer & DJ Magang",
    url: "https://unyul-yt.vercel.app",
    siteName: "Unyuls",
    images: [
      {
        url: "/assets/img/unyuls.png",
        width: 1200,
        height: 630,
        alt: "Unyul Profile",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unyul - Streamer & DJ Magang",
    description:
      "Gaming, Streaming, & DJ Magang. Ikuti keseruan Unyul di sini!",
    images: ["/assets/img/unyuls.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://unyul.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Unyul",
    url: "https://unyul-yt.vercel.app",
    image: "https://unyul-yt.vercel.app/assets/img/unyuls.png",
    sameAs: [
      "https://www.youtube.com/@Unyuls_",
      "https://www.instagram.com/unyuls/",
      "https://tiktok.com/@unyul",
    ],
    jobTitle: ["Streamer", "Gamer", "DJ Magang"],
    worksFor: {
      "@type": "Organization",
      name: "YouTube",
    },
    description:
      "Seorang content creator yang aktif melakukan live streaming game dan bermain musik sebagai DJ Magang.",
  };

  return (
    <html lang="id">
      <body
        className={`${poppins.variable} ${nabla.variable} ${righteous.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
