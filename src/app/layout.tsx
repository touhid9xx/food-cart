import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "./store/provider";
import ThemeProvider from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "FoodCart - Delicious Meals Delivered",
  description: "Order your favorite food from the best restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <StoreProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CartSidebar />
            </div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
