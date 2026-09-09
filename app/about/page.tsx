import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, GitHubIcon } from "@/components/icons";

export const metadata: Metadata = { title: "About" };

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
        <p>Built in the open. Feel free to contribute a recipe, improve a description, or help shape the next cup.</p>
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
