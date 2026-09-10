import { coffees } from "@/lib/coffees";
import { absoluteUrl, siteConfig } from "@/lib/site";

const textHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex",
};

const formatRecipe = (coffee: (typeof coffees)[number]) => [
  `## ${coffee.name}`,
  "",
  `URL: ${absoluteUrl(`/coffee/${coffee.slug}`)}`,
  `Type: ${coffee.type}`,
  `Origin: ${coffee.origin}`,
  `Served: ${coffee.served}`,
  `Profile: ${coffee.character}`,
  "",
  coffee.description,
  "",
  "### Ingredients",
  "",
  ...coffee.ingredients.map(({ amount, item, note }) => `- ${amount} ${item}${note ? ` (${note})` : ""}`),
  "",
  "### Method",
  "",
  ...coffee.steps.map((step, index) => `${index + 1}. ${step}`),
  "",
].join("\n");

export const GET = () => {
  const content = [
    `# ${siteConfig.name} complete coffee recipe catalogue`,
    "",
    `> ${siteConfig.description}`,
    "",
    `This document contains all ${coffees.length} recipes published by WhatCoffee. Proportions can vary by café, region, equipment, and personal taste.`,
    "",
    ...coffees.map(formatRecipe),
    `Source and corrections: ${siteConfig.githubUrl}`,
  ].join("\n");

  return new Response(content, { headers: textHeaders });
};
