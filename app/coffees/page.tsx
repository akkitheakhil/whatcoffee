import type { Metadata } from "next";
import { CoffeeBrowser } from "@/components/coffee-browser";
import { JsonLd } from "@/components/json-ld";
import { coffeeBrowserItems, coffees } from "@/lib/coffees";
import { createCoffeeListJsonLd, createPageMetadata } from "@/lib/seo";

const pageTitle = `${coffees.length} Coffee Recipes to Make at Home`;
const pageDescription = `Browse ${coffees.length} coffee recipes, from espresso and cappuccino to cold brew and global café drinks. Compare ingredients, origins, serving styles, and methods.`;

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/coffees",
  imageAlt: `${coffees.length} coffee recipes from WhatCoffee`,
});

export default function CoffeesPage() {
  return (
    <>
      <JsonLd data={createCoffeeListJsonLd(coffees)} />
      <main className="page-shell browse-page">
        <header className="page-heading">
          <p className="kicker">The coffee shelf</p>
          <h1>Explore coffee recipes</h1>
          <p>Browse {coffees.length} drinks with measured ingredients and short, practical methods.</p>
        </header>
        <CoffeeBrowser coffees={coffeeBrowserItems} />
      </main>
    </>
  );
}
