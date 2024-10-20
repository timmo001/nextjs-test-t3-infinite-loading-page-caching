import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "next-themes";
import { HydrateClient } from "~/trpc/server";
import { Navigation } from "~/components/navigation";

export const metadata: Metadata = {
  title: "Test",
  description: "Test",
  icons: [{ rel: "icon", url: "/icon" }],
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
              enableSystem
              disableTransitionOnChange
            >
              <Navigation />
              {children}
            </ThemeProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
