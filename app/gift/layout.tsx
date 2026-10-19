import "../globals.css";

export const metadata = {
  title: "Quà 20/10 💝",
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
