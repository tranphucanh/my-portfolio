import "../globals.css";

export const metadata = {
  title: "Happy 20/10 · IT MWG 💐",
};

export default function ItMwgLayout({
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
