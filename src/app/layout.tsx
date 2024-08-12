import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import LocalFont from "next/font/local";
import "./globals.css";
import Header from "./_components/header";
import { AuthProvider } from "./_components/auth-provider";

const poppins = Poppins({ weight: "300", variable: '--font-poppins', subsets: ["latin"] })

const calSans = LocalFont({
  src: "../../public/fonts/calsans.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  title: "VNVault",
  description: "For vn lovers",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={calSans.variable + " " + poppins.variable + " " + poppins.className + " bg-black text-white"}>
        <AuthProvider>
          <Header />
          {children} 
        </AuthProvider>
      </body>
    </html>
  );
}
