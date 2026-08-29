import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillTrack Maharashtra — Skilling Outcomes & Impact Intelligence Platform",
  description:
    "SkillTrack Maharashtra connects training, employment and long-term livelihood outcomes to help decision-makers understand what happens after certification. A longitudinal skilling-outcomes and impact-measurement system for the Government of Maharashtra.",
  keywords: [
    "SkillTrack",
    "Maharashtra",
    "skill development",
    "employment tracking",
    "livelihood outcomes",
    "SIH 2026",
    "government dashboard",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-inter)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
