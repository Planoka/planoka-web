"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FooterMinimal } from "./FooterMinimal";
import { TabBarMobile } from "./TabBarMobile";

const HIDE_NAV_PATHS = ["/onboarding"];
const HIDE_ALL_PATHS = ["/sign-in", "/sign-up"];

function isPathMatch(pathname: string, patterns: string[], locale: string): boolean {
  return patterns.some((p) => pathname === `/${locale}${p}` || pathname === `${p}`);
}

export function LayoutShell({ children, locale }: { children: React.ReactNode; locale: string }) {
  const pathname = usePathname();

  const hideAll = isPathMatch(pathname, [...HIDE_NAV_PATHS, ...HIDE_ALL_PATHS], locale);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  if (hideAll) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      {isHome ? <Footer /> : <FooterMinimal />}
      <TabBarMobile />
    </>
  );
}