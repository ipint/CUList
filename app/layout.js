import "./globals.css";

export const metadata = {
  title: "CU List",
  description: "Browse Christian Unions across the UK from the UCCF data API."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
