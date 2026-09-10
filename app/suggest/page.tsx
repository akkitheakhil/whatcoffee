import type { Metadata } from "next";
import { SuggestionForm } from "@/components/suggestion-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Suggest a Coffee Recipe",
  description: "Suggest a coffee drink or correction for the open-source WhatCoffee recipe collection.",
  path: "/suggest",
  isIndexed: false,
});

export default function SuggestPage() {
  return (
    <main className="page-shell narrow-page">
      <header className="page-heading">
        <p className="kicker">Add to the shelf</p>
        <h1>Suggest a recipe</h1>
        <p>Know a drink we should include? Share the version you make at home.</p>
      </header>
      <SuggestionForm />
    </main>
  );
}
