import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Shikho Ops Control Center",
  description: "Secure Operations Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
