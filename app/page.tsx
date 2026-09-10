import type { Metadata } from "next";
import { DiscoverExperience } from "@/components/discover-experience";
import { coffeeDiscoveryItems } from "@/lib/coffees";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  isAbsoluteTitle: true,
});

export default function Home() {
  return <DiscoverExperience coffees={coffeeDiscoveryItems} />;
}
