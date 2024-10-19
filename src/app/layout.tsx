import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "next-themes";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Test Navigation Caching",
  description: "Test Navigation Caching",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              // enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
