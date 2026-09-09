"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { coffees, doesCoffeeMatchTemperature } from "@/lib/coffees";
import type { Coffee, TemperaturePreference } from "@/lib/coffees";
import { ArrowIcon, CloseIcon, ShuffleIcon } from "./icons";

type Phase = "idle" | "spinning" | "result";
type Preferences = {
  temperature: TemperaturePreference;
  milk: "any" | "with" | "without";
  strength: number;
  sweetness: number;
};
type StoredPreferences = Omit<Partial<Preferences>, "temperature"> & {
  temperature?: Preferences["temperature"] | "Iced";
};
type IdleNeighbours = {
  readonly previous: Coffee;
  readonly next: Coffee;
};

const defaultPreferences: Preferences = {
  temperature: "any",
  milk: "any",
  strength: 3,
  sweetness: 3,
};

const reelDelays = [55, 55, 60, 65, 70, 80, 90, 105, 125, 150, 185, 225];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function chooseCoffee(preferences: Preferences, previous?: Coffee | null) {
  let pool = coffees.filter((coffee) => {
    const temperatureMatches = doesCoffeeMatchTemperature(coffee, preferences.temperature);
    const milkMatches = preferences.milk === "any" || (preferences.milk === "with" ? coffee.withMilk : !coffee.withMilk);
    return temperatureMatches && milkMatches;
  });

  if (pool.length > 1 && previous) pool = pool.filter((coffee) => coffee.slug !== previous.slug);
  if (!pool.length) pool = coffees;

  const weighted = pool.flatMap((coffee) => {
    const distance = Math.abs(coffee.strength - preferences.strength) + Math.abs(coffee.sweetness - preferences.sweetness);
    const weight = Math.max(1, 7 - distance);
    return Array.from({ length: weight }, () => coffee);
  });

  return randomItem(weighted);
}

function getNeighbors(coffee: Coffee) {
  const index = coffees.findIndex((item) => item.slug === coffee.slug);
  return {
    previous: coffees[(index - 1 + coffees.length) % coffees.length],
    next: coffees[(index + 1) % coffees.length],
  };
}

const createIdleNeighbours = (): IdleNeighbours => {
  const previous = randomItem(coffees);
  const remainingCoffees = coffees.filter((coffee) => coffee.slug !== previous.slug);

  return {
    previous,
    next: randomItem(remainingCoffees),
  };
};

export function DiscoverExperience() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState<Coffee>(coffees[4]);
  const [idleNeighbours, setIdleNeighbours] = useState<IdleNeighbours | null>(null);
  const [selected, setSelected] = useState<Coffee | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [reelKey, setReelKey] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIdleNeighbours(createIdleNeighbours()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("whatcoffee-preferences");
    if (!saved) return;
    let nextPreferences: Preferences | null = null;
    try {
      const storedPreferences = JSON.parse(saved) as StoredPreferences;
      nextPreferences = {
        ...defaultPreferences,
        ...storedPreferences,
        temperature: storedPreferences.temperature === "Iced"
          ? "Cold"
          : storedPreferences.temperature ?? defaultPreferences.temperature,
      };
    } catch {
      window.localStorage.removeItem("whatcoffee-preferences");
    }
    if (!nextPreferences) return;
    const timer = window.setTimeout(() => setPreferences(nextPreferences), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const spin = useCallback((nextPreferences = preferences) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    const matchingPool = coffees.filter((coffee) =>
      doesCoffeeMatchTemperature(coffee, nextPreferences.temperature) &&
      (nextPreferences.milk === "any" || (nextPreferences.milk === "with" ? coffee.withMilk : !coffee.withMilk)),
    );
    const pool = matchingPool.length ? matchingPool : coffees;
    const finalCoffee = chooseCoffee(nextPreferences, selected);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDisplayed(randomItem(pool));
    setReelKey((key) => key + 1);
    setPhase("spinning");
    setSelected(null);

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setDisplayed(finalCoffee);
        setSelected(finalCoffee);
        setPhase("result");
      }, 140);
      timers.current.push(timer);
      return;
    }

    const sequence = reelDelays.map(() => randomItem(pool));
    sequence[sequence.length - 1] = finalCoffee;

    let elapsed = 0;
    sequence.forEach((coffee, index) => {
      elapsed += reelDelays[index];
      const timer = window.setTimeout(() => {
        setDisplayed(coffee);
        setReelKey((key) => key + 1);
      }, elapsed);
      timers.current.push(timer);
    });

    const settleTimer = window.setTimeout(() => {
      setDisplayed(finalCoffee);
      setSelected(finalCoffee);
      setPhase("result");
    }, elapsed + 240);
    timers.current.push(settleTimer);
  }, [preferences, selected]);

  const savePreferences = (next: Preferences, spinNow: boolean) => {
    setPreferences(next);
    window.localStorage.setItem("whatcoffee-preferences", JSON.stringify(next));
    setPreferencesOpen(false);
    if (spinNow) spin(next);
  };

  const neighbors = useMemo(() => getNeighbors(displayed), [displayed]);
  const isIdle = phase === "idle";
  const isSpinning = phase === "spinning";
  const isResult = phase === "result";
  const previousName = isIdle ? idleNeighbours?.previous.name ?? "…" : neighbors.previous.name;
  const currentName = isIdle ? "?" : displayed.name;
  const nextName = isIdle ? idleNeighbours?.next.name ?? "…" : neighbors.next.name;
  const primaryLabel = isSpinning ? "Choosing…" : isResult ? "Spin again" : "Surprise me";
  const primaryDescription = isSpinning
    ? "Finding your next drink"
    : isResult
      ? "Try another coffee"
      : `Pick from ${coffees.length} drinks`;

  return (
    <main className="discover-shell">
      <section className="discover-copy" aria-labelledby="discover-title">
        <h1 id="discover-title">What coffee should I make?</h1>
        <p>Leave the decision to us. You might find a new favourite.</p>
      </section>

      <div className="discover-stage">
        <section className="reel-area" aria-label="Random coffee picker" aria-busy={isIdle && !idleNeighbours}>
          <div className="reel-window" data-phase={phase}>
            <span className="reel-rule" aria-hidden="true" />
            <div className="reel-track" key={isIdle ? idleNeighbours?.previous.slug ?? "idle" : reelKey}>
              <span className="reel-neighbor">{previousName}</span>
              <span className="reel-current" aria-label={isIdle ? "Unknown coffee" : undefined}>{currentName}</span>
              <span className="reel-neighbor">{nextName}</span>
            </div>
            <span className="reel-rule" aria-hidden="true" />
          </div>

          <div className="result-copy" data-visible={phase === "result" ? "true" : undefined} aria-live="polite">
            {selected ? (
              <>
                <p className="result-tags"><span>{selected.type}</span><span>{selected.served}</span><span>{selected.origin}</span></p>
                <p className="result-description">{selected.character}</p>
              </>
            ) : null}
          </div>
        </section>

        {isResult && selected ? (
          <Link href={`/coffee/${selected.slug}`} className="recipe-cta">
            <span>View recipe</span>
            <span className="recipe-cta-arrow"><ArrowIcon /></span>
          </Link>
        ) : null}

        <div className="discover-actions">
          <button className="button button-primary discover-primary-action" type="button" onClick={() => spin()} disabled={isSpinning}>
            <span className="discover-primary-copy">
              <strong>{primaryLabel}</strong>
              <small>{primaryDescription}</small>
            </span>
            <span className="discover-primary-icon"><ShuffleIcon className={isSpinning ? "is-spinning" : ""} /></span>
          </button>
          <button className="button button-quiet discover-secondary-action" type="button" onClick={() => setPreferencesOpen(true)} disabled={isSpinning}>
            Set preferences
          </button>
        </div>
      </div>

      <div className="discover-foot">
        <button type="button" onClick={() => setPreferencesOpen(true)}>Adjust preferences</button>
        <span aria-hidden="true">·</span>
        <Link href="/coffees">Browse all coffees</Link>
      </div>

      <PreferencesPanel
        open={preferencesOpen}
        preferences={preferences}
        onClose={() => setPreferencesOpen(false)}
        onSave={savePreferences}
      />
    </main>
  );
}

function PreferencesPanel({
  open,
  preferences,
  onClose,
  onSave,
}: {
  open: boolean;
  preferences: Preferences;
  onClose: () => void;
  onSave: (preferences: Preferences, spinNow: boolean) => void;
}) {
  const [draft, setDraft] = useState(preferences);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className="preference-layer" data-open={open ? "true" : undefined} aria-hidden={!open}>
      <button className="preference-backdrop" type="button" aria-label="Close preferences" tabIndex={open ? 0 : -1} onClick={onClose} />
      <section className="preference-panel" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
        <div className="preference-head">
          <div>
            <h2 id="preferences-title">Make it personal</h2>
            <p>Adjust a few preferences—or leave them open.</p>
          </div>
          <button className="icon-button icon-button-dark" type="button" aria-label="Close preferences" onClick={onClose}><CloseIcon /></button>
        </div>

        <PreferenceChoice
          label="Temperature"
          value={draft.temperature}
          options={[{ value: "any", label: "Any" }, { value: "Hot", label: "Hot" }, { value: "Cold", label: "Cold" }]}
          onChange={(temperature) => setDraft({ ...draft, temperature: temperature as Preferences["temperature"] })}
        />
        <PreferenceChoice
          label="Milk"
          value={draft.milk}
          options={[{ value: "any", label: "Any" }, { value: "with", label: "With milk" }, { value: "without", label: "No milk" }]}
          onChange={(milk) => setDraft({ ...draft, milk: milk as Preferences["milk"] })}
        />

        <label className="range-field">
          <span><strong>Perceived strength</strong><output>{draft.strength} / 5</output></span>
          <input type="range" min="1" max="5" step="1" value={draft.strength} onChange={(event) => setDraft({ ...draft, strength: Number(event.target.value) })} />
          <small><span>Mild</span><span>Strong</span></small>
        </label>
        <label className="range-field">
          <span><strong>Perceived sweetness</strong><output>{draft.sweetness} / 5</output></span>
          <input type="range" min="1" max="5" step="1" value={draft.sweetness} onChange={(event) => setDraft({ ...draft, sweetness: Number(event.target.value) })} />
          <small><span>Not sweet</span><span>Very sweet</span></small>
        </label>

        <button className="button button-light preference-submit" type="button" onClick={() => onSave(draft, true)}>
          Surprise me <ShuffleIcon />
        </button>
      </section>
    </div>
  );
}

function PreferenceChoice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="preference-choice">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button key={option.value} type="button" data-active={option.value === value ? "true" : undefined} onClick={() => onChange(option.value)}>{option.label}</button>
        ))}
      </div>
    </fieldset>
  );
}
