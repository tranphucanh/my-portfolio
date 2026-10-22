import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import AstronautCanvas from "@/components/main/Astronaut";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phuc Anh | Software Engineer",
  description:
    "Phuc Anh – Software Engineer building web and mobile products with React, Next.js, TypeScript and React Native.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="bYfY6Sf3ofOdZk0g1hEPEEfYXTDo8SxKDCd8WIf0enE"
        />
      </head>

      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}
      >
        <StarsCanvas />
        <AstronautCanvas />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
