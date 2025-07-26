import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MinglUp",
  description: "Mingle with your friends",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />

        <html lang="en">
          <body className={`${jakartaSans.variable} antialiased`}>
            <ConvexClientProvider>
              <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
            </ConvexClientProvider>
          </body>
        </html>
      </ThemeProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
