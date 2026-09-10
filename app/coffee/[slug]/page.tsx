import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrinkVisual } from "@/components/drink-visual";
import { BackIcon, CupIcon, PinIcon, TemperatureIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { coffees, getCoffee, getRelatedCoffees } from "@/lib/coffees";
import { createCoffeeJsonLd, createPageMetadata, getCoffeeImagePath, getCoffeeMetadataDescription } from "@/lib/seo";

export function generateStaticParams() {
  return coffees.map((coffee) => ({ slug: coffee.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const coffee = getCoffee((await params).slug);
  if (!coffee) return { title: "Coffee not found", robots: { index: false, follow: false } };

  return createPageMetadata({
    title: `${coffee.name} Recipe`,
    description: getCoffeeMetadataDescription(coffee),
    path: `/coffee/${coffee.slug}`,
    imagePath: getCoffeeImagePath(coffee.slug),
    imageAlt: `${coffee.name} coffee recipe`,
    type: "article",
  });
}

export default async function CoffeePage({ params }: { params: Promise<{ slug: string }> }) {
  const coffee = getCoffee((await params).slug);
  if (!coffee) notFound();
  const relatedCoffees = getRelatedCoffees(coffee);

  return (
    <>
      <JsonLd data={createCoffeeJsonLd(coffee)} />
      <main className="page-shell coffee-detail">
        <Link href="/coffees" className="back-link"><BackIcon /> Back to coffee recipes</Link>
        <section className="detail-hero">
          <div className="detail-title">
            <p className="kicker">{coffee.type}</p>
            <h1>{coffee.name}</h1>
            <p>{coffee.description}</p>
          </div>
          <DrinkVisual coffee={coffee} large />
          <dl className="coffee-facts">
            <div><dt><CupIcon /><span>Type</span></dt><dd>{coffee.type}</dd></div>
            <div><dt><PinIcon /><span>Origin</span></dt><dd>{coffee.origin}</dd></div>
            <div><dt><TemperatureIcon /><span>Served</span></dt><dd>{coffee.served}</dd></div>
          </dl>
        </section>

        <section className="recipe-section">
          <div className="section-label"><span>{coffee.recipeTitle}</span><Link href="/suggest">Suggest an edit</Link></div>
          <h2>How to make {coffee.name}</h2>
          <div className="recipe-grid">
            <div className="ingredients-list">
              {coffee.ingredients.map((ingredient) => (
                <div key={`${ingredient.item}-${ingredient.amount}`}><strong>{ingredient.item}</strong><span>{ingredient.amount}</span>{ingredient.note ? <small>{ingredient.note}</small> : null}</div>
              ))}
            </div>
            <ol className="steps-list">
              {coffee.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
        </section>

        <section className="related-recipes" aria-labelledby="related-recipes-title">
          <div className="section-label"><span>Keep exploring</span><Link href="/coffees">View all {coffees.length}</Link></div>
          <h2 id="related-recipes-title">More coffee recipes</h2>
          <div className="related-recipe-list">
            {relatedCoffees.map((relatedCoffee) => (
              <Link href={`/coffee/${relatedCoffee.slug}`} key={relatedCoffee.slug}>
                <strong>{relatedCoffee.name}</strong>
                <span>{relatedCoffee.character}</span>
                <small>{relatedCoffee.served} · {relatedCoffee.origin}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
