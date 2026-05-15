import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
// import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phuc Anh | Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  // if (pathname === "/happy-birthday") {
  //   return <div>{children}</div>;
  // }
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
