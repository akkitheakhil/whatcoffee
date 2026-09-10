import type { CoffeeBrowserItem } from "@/lib/coffees";

type DrinkVisualProps = {
  readonly coffee: Pick<CoffeeBrowserItem, "tone" | "visual" | "withMilk">;
  readonly large?: boolean;
};

export const DrinkVisual = ({ coffee, large = false }: DrinkVisualProps) => {
  const isIced = coffee.visual === "iced";
  const isCold = coffee.visual === "cold";
  const isGlass = isIced || isCold;
  const isEspresso = coffee.visual === "espresso";
  const isBlack = coffee.visual === "black";
  const isGreen = coffee.visual === "green";
  const isDessert = coffee.visual === "dessert";

  return (
    <div className="drink-stage" data-large={large ? "true" : undefined} style={{ "--drink-tone": coffee.tone } as React.CSSProperties} aria-hidden="true">
      <span className="stage-rule stage-rule-left" />
      <span className="stage-rule stage-rule-right" />
      <div className={`drink-vessel ${isGlass ? "drink-glass" : isEspresso ? "drink-espresso" : "drink-cup"}`}>
        {isGlass ? (
          <>
            {isIced ? <><span className="ice ice-one" /><span className="ice ice-two" /><span className="ice ice-three" /></> : null}
            {coffee.withMilk ? (
              <><span className="drink-layer drink-layer-milk" /><span className="drink-layer drink-layer-coffee" /></>
            ) : (
              <span className="drink-layer drink-layer-black" />
            )}
            {isCold ? <span className="cold-crema" /> : null}
            {isIced ? <span className="straw" /> : null}
          </>
        ) : (
          <>
            <span className={`coffee-surface ${isGreen ? "surface-green" : ""} ${isBlack ? "surface-black" : ""} ${isDessert ? "surface-dessert" : ""}`}>
              {!isBlack && !isEspresso && <span className="latte-leaf">⌇</span>}
            </span>
            {!isEspresso && <span className="cup-handle" />}
          </>
        )}
      </div>
      <span className="drink-shadow" />
    </div>
  );
};
