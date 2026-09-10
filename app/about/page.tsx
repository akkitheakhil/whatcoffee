import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, GitHubIcon } from "@/components/icons";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About WhatCoffee",
  description: "WhatCoffee is a free, open-source coffee picker and recipe library designed to make choosing, understanding, and preparing a new drink easier.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      <section className="about-lead">
        <p className="kicker">A small open-source coffee project</p>
        <h1>Better mornings through small discoveries.</h1>
        <p>WhatCoffee helps you choose a drink, understand what is in it, and make it without wading through a recipe blog.</p>
      </section>
      <section className="about-grid">
        <div><span>01</span><h2>Spin</h2><p>Leave the decision to chance or add a few preferences.</p></div>
        <div><span>02</span><h2>Learn</h2><p>See the proportions, origin, and character of the drink.</p></div>
        <div><span>03</span><h2>Make</h2><p>Follow a short recipe, then share your own variation.</p></div>
      </section>
      <div className="about-contribute">
        <p>Recipes are practical starting points; café traditions and proportions vary by region and equipment. WhatCoffee is built in the open, so you can contribute a recipe, improve a description, or review corrections on GitHub.</p>
        <a className="button button-outline" href="https://github.com/akkitheakhil/whatcoffee" target="_blank" rel="noopener noreferrer">
          <GitHubIcon /> Contribute on GitHub <ArrowIcon />
        </a>
      </div>
      <div className="about-actions">
        <Link href="/" className="button button-primary">Find a coffee <ArrowIcon /></Link>
        <Link href="/suggest" className="button button-outline">Suggest a recipe</Link>
      </div>
    </main>
  );
}
