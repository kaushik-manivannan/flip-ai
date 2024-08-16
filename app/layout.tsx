import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { hslToRgb } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flip AI",
  description: "Create Flashcards from your text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'hsl(217.2, 91.2%, 59.8%)',
          colorBackground: 'hsl(222.2, 84%, 4.9%)',
          colorText: 'hsl(210, 40%, 98%)',
          colorInputBackground: 'hsl(217.2, 32.6%, 17.5%)',
          colorTextSecondary: 'hsl(215, 20.2%, 65.1%)',
          colorTextOnPrimaryBackground: 'hsl(222.2, 47.4%, 11.2%)',
          colorInputText: 'hsl(210, 40%, 98%)',
          colorNeutral: 'hsl(217.2, 91.2%, 59.8%)',
        },
        elements: {
          formButtonPrimary: 
            'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-card text-card-foreground',
          navbar: 'bg-background',
          headerTitle: 'dark:text-primary text-2xl mb-2',
          headerSubtitle: 'dark:text-foreground text-sm',
          cardBox: 'border border-muted border-primary/[0.2]',
          button: 'dark:text-foreground',
          dividerLine: 'bg-muted',
          socialButtonsBlockButton: '!border !border-2 !border-muted'
        },
      }}
    >
      <html lang="en" className="dark scroll-smooth">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
