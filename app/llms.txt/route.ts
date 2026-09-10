import { coffees } from "@/lib/coffees";
import { absoluteUrl, siteConfig } from "@/lib/site";

const textHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex",
};

export const GET = () => {
  const recipeLinks = coffees
    .map((coffee) => `- [${coffee.name} recipe](${absoluteUrl(`/coffee/${coffee.slug}`)}): ${coffee.description}`)
    .join("\n");
  const content = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "WhatCoffee is a free, open-source coffee picker and recipe library. Each recipe page includes measured ingredients, preparation steps, origin, serving style, and a short flavour description.",
    "",
    "## Main pages",
    "",
    `- [Coffee picker](${absoluteUrl("/")}): Get a random drink suggestion and tune temperature, milk, strength, and sweetness preferences.`,
    `- [Coffee recipe directory](${absoluteUrl("/coffees")}): Browse and search the complete recipe collection.`,
    `- [About WhatCoffee](${absoluteUrl("/about")}): Learn how the project works and how to contribute.`,
    `- [Complete machine-readable catalogue](${absoluteUrl("/llms-full.txt")}): Read every recipe in one text document.`,
    "",
    "## Coffee recipes",
    "",
    recipeLinks,
    "",
    "## Project",
    "",
    `- [Source code and contributions](${siteConfig.githubUrl})`,
  ].join("\n");

  return new Response(content, { headers: textHeaders });
};
