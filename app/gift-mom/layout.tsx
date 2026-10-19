import "../globals.css";

export const metadata = {
  title: "Gửi Mẹ yêu 20/10 💐",
};

export default function GiftMomLayout({
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
