import type { Metadata } from "next";
import { CoffeeBrowser } from "@/components/coffee-browser";

export const metadata: Metadata = { title: "Explore coffees", description: "Browse coffee drinks from familiar classics to hidden gems." };

export default function CoffeesPage() {
  return (
    <main className="page-shell browse-page">
      <header className="page-heading">
        <p className="kicker">The coffee shelf</p>
        <h1>Explore coffees</h1>
        <p>From familiar classics to drinks you may not have met yet.</p>
      </header>
      <CoffeeBrowser />
    </main>
  );
}
