import type { Metadata } from "next";
import {
  Bebas_Neue,
  JetBrains_Mono,
  New_Amsterdam,
  Playfair_Display,
  Water_Brush,
} from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "400"],
  variable: "--font-mono",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const waterBrush = Water_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
});

const newAmsterdam = New_Amsterdam({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-condensed",
});

export const metadata: Metadata = {
  title: "WALUY.STUDIO — Mesin Penghasil Alasan",
  description: "Random alasan untuk segala situasi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={[
        jetbrainsMono.variable,
        bebasNeue.variable,
        waterBrush.variable,
        playfairDisplay.variable,
        newAmsterdam.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
