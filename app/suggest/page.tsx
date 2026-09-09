import type { Metadata } from "next";
import { SuggestionForm } from "@/components/suggestion-form";

export const metadata: Metadata = { title: "Suggest a recipe" };

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
