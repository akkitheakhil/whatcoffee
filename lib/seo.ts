import type { Metadata } from "next";
import type { Coffee } from "@/lib/coffees";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageMetadataOptions = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly imagePath?: string;
  readonly imageAlt?: string;
  readonly type?: "article" | "website";
  readonly isAbsoluteTitle?: boolean;
  readonly isIndexed?: boolean;
};

const indexedRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const createPageMetadata = ({
  title,
  description,
  path,
  imagePath = siteConfig.socialImagePath,
  imageAlt = "WhatCoffee coffee picker and recipe library",
  type = "website",
  isAbsoluteTitle = false,
  isIndexed = true,
}: PageMetadataOptions): Metadata => ({
  title: isAbsoluteTitle ? { absolute: title } : title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type,
    images: [{ url: imagePath, width: 1200, height: 630, alt: imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: imagePath, alt: imageAlt }],
  },
  robots: isIndexed ? indexedRobots : { index: false, follow: true },
});

export const getCoffeeMetadataDescription = (coffee: Coffee) =>
  `Learn how to make ${coffee.name} at home with measured ingredients and ${coffee.steps.length} clear steps. See its origin, serving style, and flavour profile.`;

export const getCoffeeImagePath = (slug: string, ratio: "1x1" | "4x3" | "16x9" | "social" = "social") =>
  `/coffee/${slug}/image/${ratio}`;

export const getCoffeeImageUrls = (slug: string) => [
  absoluteUrl(getCoffeeImagePath(slug, "1x1")),
  absoluteUrl(getCoffeeImagePath(slug, "4x3")),
  absoluteUrl(getCoffeeImagePath(slug, "16x9")),
];

export const createSiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: `${siteConfig.url}/`,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${siteConfig.url}/#organisation` },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organisation`,
      name: siteConfig.name,
      url: `${siteConfig.url}/`,
      logo: absoluteUrl("/icon.svg"),
      sameAs: [siteConfig.githubUrl],
    },
  ],
});

export const createCoffeeListJsonLd = (coffees: readonly Coffee[]) => {
  const pageUrl = absoluteUrl("/coffees");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: `${coffees.length} coffee recipes to make at home`,
        description: `Browse ${coffees.length} coffee recipes with measured ingredients and clear preparation steps.`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: { "@id": `${pageUrl}#recipes` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#recipes`,
        name: "WhatCoffee recipe collection",
        numberOfItems: coffees.length,
        itemListElement: coffees.map((coffee, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: coffee.name,
          url: absoluteUrl(`/coffee/${coffee.slug}`),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Discover", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: "Coffee recipes", item: pageUrl },
        ],
      },
    ],
  };
};

const getRecipeCuisine = (origin: string) => {
  const isGeneralOrigin = /culture|tradition|inspired|popularised/i.test(origin);
  return isGeneralOrigin ? undefined : origin;
};

export const createCoffeeJsonLd = (coffee: Coffee) => {
  const pageUrl = absoluteUrl(`/coffee/${coffee.slug}`);
  const recipeCuisine = getRecipeCuisine(coffee.origin);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        "@id": `${pageUrl}#recipe`,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        name: coffee.name,
        description: coffee.description,
        image: getCoffeeImageUrls(coffee.slug),
        author: { "@id": `${siteConfig.url}/#organisation` },
        recipeCategory: coffee.type,
        ...(recipeCuisine ? { recipeCuisine } : {}),
        keywords: [coffee.name, `${coffee.name} recipe`, coffee.type, coffee.origin, coffee.served].join(", "),
        recipeIngredient: coffee.ingredients.map(({ amount, item, note }) =>
          `${amount} ${item}${note ? ` (${note})` : ""}`,
        ),
        recipeInstructions: coffee.steps.map((step) => ({
          "@type": "HowToStep",
          text: step,
        })),
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: siteConfig.language,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Discover", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: "Coffee recipes", item: absoluteUrl("/coffees") },
          { "@type": "ListItem", position: 3, name: coffee.name, item: pageUrl },
        ],
      },
    ],
  };
};
