import "../globals.css";

export const metadata = {
  title: "Happy Birthday!",
};

export default function HappyBirthdayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
