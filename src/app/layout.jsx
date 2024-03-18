import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <header>
          <Navigation />
        </header>
        <main className="mx-auto my-8 sm:my-14 max-w-[700px]">
        {children}
        </main>
      </body>
    </html>
  );
}
