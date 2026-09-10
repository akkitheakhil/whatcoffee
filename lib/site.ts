const localSiteUrl = "http://localhost:3000";

const normaliseSiteUrl = (value: string | undefined) => {
  if (!value) return localSiteUrl;

  const valueWithProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(valueWithProtocol).origin;
  } catch {
    return localSiteUrl;
  }
};

export const siteConfig = {
  name: "WhatCoffee",
  title: "WhatCoffee: Coffee Picker & Coffee Recipes",
  description: "Can't decide what coffee to make? Spin the coffee picker or browse clear drink recipes with measured ingredients, simple steps, origins, and serving notes.",
  url: normaliseSiteUrl(
    process.env.SITE_URL
      ?? process.env.VERCEL_PROJECT_PRODUCTION_URL
      ?? process.env.VERCEL_URL,
  ),
  githubUrl: "https://github.com/akkitheakhil/whatcoffee",
  locale: "en_US",
  language: "en",
  socialImagePath: "/social-card",
} as const;

export const absoluteUrl = (path: string) => new URL(path, `${siteConfig.url}/`).toString();
