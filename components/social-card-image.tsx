type SocialCardImageProps = {
  readonly accent: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly facts: readonly string[];
  readonly height: number;
  readonly title: string;
  readonly width: number;
};

export const SocialCardImage = ({
  accent,
  description,
  eyebrow,
  facts,
  height,
  title,
  width,
}: SocialCardImageProps) => {
  const isSquare = width === height;
  const titleSize = 82;
  const vesselSize = isSquare ? 270 : 285;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isSquare ? "76px" : "62px 72px",
        background: "#f5eee4",
        color: "#241a15",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-1.5px" }}>whatcoffee</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase" }}>{eyebrow}</span>
      </div>

      <div style={{ display: "flex", flexDirection: isSquare ? "column" : "row", alignItems: isSquare ? "stretch" : "center", justifyContent: "space-between", gap: isSquare ? "36px" : "56px" }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", maxWidth: isSquare ? "100%" : "700px" }}>
          <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 0.94, letterSpacing: "-0.055em" }}>{title}</div>
          <div style={{ marginTop: 28, maxWidth: "680px", fontFamily: "sans-serif", fontSize: isSquare ? 30 : 27, lineHeight: 1.35, color: "#66574d" }}>
            {description}
          </div>
        </div>

        <div style={{ width: vesselSize + 70, height: vesselSize + 70, display: "flex", alignSelf: "center", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#eadfce" }}>
          <div style={{ width: vesselSize, height: vesselSize * 0.42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#cdb89d" }}>
            <div style={{ width: vesselSize * 0.72, height: vesselSize * 0.58, display: "flex", alignItems: "center", justifyContent: "center", border: "8px solid #ad9578", borderRadius: "0 0 80px 80px", background: "#f8f2ea" }}>
              <div style={{ width: vesselSize * 0.58, height: vesselSize * 0.24, borderRadius: "50%", background: accent, boxShadow: "inset 0 0 0 12px rgba(255,255,255,0.18)" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "22px", fontFamily: "sans-serif", fontSize: 20, color: "#66574d" }}>
        {facts.map((fact) => <span key={fact}>{fact}</span>)}
      </div>
    </div>
  );
};
