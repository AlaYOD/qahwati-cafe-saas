import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Qahwati | Cafe SaaS",
  description: "Modern POS and Cafe Management ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(montserrat.variable, openSans.variable)} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${openSans.variable} ${montserrat.variable} bg-white dark:bg-background font-sans text-slate-900 dark:text-slate-100 antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

