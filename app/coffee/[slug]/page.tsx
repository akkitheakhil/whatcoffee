import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrinkVisual } from "@/components/drink-visual";
import { BackIcon, CupIcon, PinIcon, TemperatureIcon } from "@/components/icons";
import { coffees, getCoffee } from "@/lib/coffees";

export function generateStaticParams() {
  return coffees.map((coffee) => ({ slug: coffee.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const coffee = getCoffee((await params).slug);
  return coffee ? { title: coffee.name, description: coffee.description } : {};
}

export default async function CoffeePage({ params }: { params: Promise<{ slug: string }> }) {
  const coffee = getCoffee((await params).slug);
  if (!coffee) notFound();

  return (
    <main className="page-shell coffee-detail">
      <Link href="/coffees" className="back-link"><BackIcon /> Back to coffees</Link>
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
        <div className="section-label"><span>Recipe</span><Link href="/suggest">Suggest an edit</Link></div>
        <h2>{coffee.recipeTitle}</h2>
        <div className="recipe-grid">
          <div className="ingredients-list">
            {coffee.ingredients.map((ingredient) => (
              <div key={`${ingredient.item}-${ingredient.amount}`}><strong>{ingredient.item}</strong><span>{ingredient.amount}</span>{ingredient.note && <small>{ingredient.note}</small>}</div>
            ))}
          </div>
          <ol className="steps-list">
            {coffee.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}
