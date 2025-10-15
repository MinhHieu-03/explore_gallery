import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import Providers from "./providers";
import Link from "next/link";

export const metadata = {
  title: "Explore Gallery",
  description: "Explore photos — search, filter, sort and infinite scroll",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen transition-colors duration-300">
        <header>
          <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Explore Gallery
            </Link>
            <nav className="flex gap-3">
              <Link
                href="/create"
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                Create Item
              </Link>
              <Link href="/" className="px-3 py-1 rounded hover:bg-gray-100">
                Explore
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <Providers>
          <main className="max-w-7xl mx-auto">{children}</main>
        </Providers>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 p-6">
          © Explore Gallery
        </footer>
      </body>
    </html>
  );
}
