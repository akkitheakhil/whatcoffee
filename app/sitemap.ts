import type { MetadataRoute } from "next";
import { coffees } from "@/lib/coffees";
import { absoluteUrl } from "@/lib/site";
import { getCoffeeImagePath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = ["/", "/coffees", "/about"].map((path) => ({
    url: absoluteUrl(path),
  }));
  const recipePages: MetadataRoute.Sitemap = coffees.map((coffee) => ({
    url: absoluteUrl(`/coffee/${coffee.slug}`),
    images: [absoluteUrl(getCoffeeImagePath(coffee.slug, "16x9"))],
  }));

  return [...staticPages, ...recipePages];
}
