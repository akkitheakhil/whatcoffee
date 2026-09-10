type TemperatureCoffee = {
  readonly served: "Cold" | "Hot" | "Hot & cold" | "Iced";
};

export type TemperaturePreference = "any" | "Cold" | "Hot";

export const doesCoffeeMatchTemperature = (
  coffee: TemperatureCoffee,
  temperature: TemperaturePreference,
) => {
  if (temperature === "any") return true;
  if (coffee.served === "Hot & cold") return true;
  if (temperature === "Cold") return coffee.served === "Cold" || coffee.served === "Iced";
  return coffee.served === "Hot";
};
