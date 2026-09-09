import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell empty-state standalone-empty">
      <p className="kicker">404</p>
      <h1>That cup isn’t on the shelf.</h1>
      <p>Try browsing the coffee collection instead.</p>
      <Link href="/coffees" className="button button-primary">Browse coffees</Link>
    </main>
  );
}
