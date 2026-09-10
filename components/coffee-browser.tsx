"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CoffeeBrowserItem } from "@/lib/coffees";
import { doesCoffeeMatchTemperature } from "@/lib/coffee-preferences";
import { ArrowIcon, SearchIcon } from "./icons";
import { DrinkVisual } from "./drink-visual";

const filters = ["All", "Hot", "Cold", "With milk", "No milk"] as const;
type Filter = (typeof filters)[number];

type CoffeeBrowserProps = {
  readonly coffees: readonly CoffeeBrowserItem[];
};

export const CoffeeBrowser = ({ coffees }: CoffeeBrowserProps) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return coffees.filter((coffee) => {
      const matchesSearch = !normalized || [coffee.name, coffee.origin, coffee.type, coffee.description].join(" ").toLowerCase().includes(normalized);
      const matchesFilter = filter === "All"
        || (filter === "Hot" || filter === "Cold" ? doesCoffeeMatchTemperature(coffee, filter) : false)
        || (filter === "With milk" ? coffee.withMilk : filter === "No milk" ? !coffee.withMilk : false);
      return matchesSearch && matchesFilter;
    });
  }, [coffees, filter, query]);
  const hasSearch = query.trim().length > 0;
  const emptyTitle = hasSearch ? "No coffee matches that search." : "No coffee in this filter.";
  const emptyDescription = hasSearch
    ? `Nothing matched “${query.trim()}”. Try another name or clear the filters.`
    : "Try another filter or browse the full coffee shelf.";

  return (
    <>
      <div className="browse-tools">
        <label className="search-field">
          <SearchIcon />
          <span className="sr-only">Search coffees</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coffees…" />
        </label>
        <div className="filter-row" aria-label="Filter coffees">
          {filters.map((item) => (
            <button key={item} type="button" data-active={filter === item ? "true" : undefined} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="coffee-grid">
          {results.map((coffee) => (
            <Link href={`/coffee/${coffee.slug}`} className="coffee-card" key={coffee.slug}>
              <DrinkVisual coffee={coffee} />
              <div className="coffee-card-copy">
                <p>{coffee.served}<span aria-hidden="true">·</span>{coffee.type}</p>
                <h2>{coffee.name}</h2>
                <span className="card-arrow" aria-hidden="true"><ArrowIcon /></span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status" aria-live="polite">
          <p className="kicker">The shelf is quiet</p>
          <h2>{emptyTitle}</h2>
          <p>{emptyDescription}</p>
          <button className="button button-outline" type="button" onClick={() => { setQuery(""); setFilter("All"); }}>Show all coffees</button>
        </div>
      )}
    </>
  );
};
