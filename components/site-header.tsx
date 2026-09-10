"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/", label: "Discover" },
  { href: "/coffees", label: "Coffee recipes" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="WhatCoffee home">whatcoffee</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} data-active={pathname === item.href ? "true" : undefined}>{item.label}</Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="mobile-actions">
          <ThemeToggle />
          <button className="icon-button" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon /></button>
        </div>
      </header>

      <div className="menu-overlay" data-open={open ? "true" : undefined} aria-hidden={!open} onClick={() => setOpen(false)} />
      <aside className="mobile-menu" data-open={open ? "true" : undefined} aria-hidden={!open}>
        <div className="mobile-menu-head">
          <span className="wordmark">whatcoffee</span>
          <button className="icon-button" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button>
        </div>
        <nav aria-label="Mobile navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link href="/suggest" onClick={() => setOpen(false)}>Suggest a recipe</Link>
        </nav>
        <p>Pick a coffee. Learn the recipe. Make something good.</p>
      </aside>
    </>
  );
}
