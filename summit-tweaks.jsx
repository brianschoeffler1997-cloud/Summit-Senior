/* Summit redesign — Tweaks app.
   Renders ONLY the Tweaks panel; applies choices to the live static page
   via <html> data-attributes + CSS variables. */

const SUMMIT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline": "serif",
  "overlay": "balanced",
  "corners": "soft",
  "headlineText": "Senior moving & downsizing, handled with care."
}/*EDITMODE-END*/;

const CORNER_MAP = {
  sharp: { card: "2px", btn: "2px", img: "3px" },
  soft:  { card: "8px", btn: "6px", img: "10px" },
  round: { card: "16px", btn: "12px", img: "20px" },
};

const OVERLAY_MAP = { lighter: "0.14", balanced: "0.28", darker: "0.46" };

function applySummitTweaks(t) {
  const root = document.documentElement;
  root.setAttribute("data-headline", t.headline);
  const c = CORNER_MAP[t.corners] || CORNER_MAP.soft;
  root.style.setProperty("--radius-card", c.card);
  root.style.setProperty("--radius-btn", c.btn);
  root.style.setProperty("--radius-img", c.img);
  const hero = document.querySelector(".hero");
  if (hero) hero.style.setProperty("--hero-ov", OVERLAY_MAP[t.overlay] || OVERLAY_MAP.balanced);
  const h1 = document.getElementById("heroHeadline");
  if (h1 && typeof t.headlineText === "string" && t.headlineText.trim()) {
    h1.textContent = t.headlineText;
  }
}

function SummitTweaksApp() {
  const [t, setTweak] = useTweaks(SUMMIT_TWEAK_DEFAULTS);

  React.useEffect(() => { applySummitTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Typography" />
      <TweakRadio
        label="Headline type"
        value={t.headline}
        options={[
          { value: "serif", label: "Serif" },
          { value: "sans", label: "Sans" },
        ]}
        onChange={(v) => setTweak("headline", v)}
      />
      <TweakText
        label="Hero headline"
        value={t.headlineText}
        onChange={(v) => setTweak("headlineText", v)}
      />

      <TweakSection label="Hero" />
      <TweakRadio
        label="Photo overlay"
        value={t.overlay}
        options={[
          { value: "lighter", label: "Lighter" },
          { value: "balanced", label: "Balanced" },
          { value: "darker", label: "Darker" },
        ]}
        onChange={(v) => setTweak("overlay", v)}
      />

      <TweakSection label="Shape" />
      <TweakRadio
        label="Corners"
        value={t.corners}
        options={[
          { value: "sharp", label: "Sharp" },
          { value: "soft", label: "Soft" },
          { value: "round", label: "Round" },
        ]}
        onChange={(v) => setTweak("corners", v)}
      />
    </TweaksPanel>
  );
}

// Apply the current defaults immediately (host keeps the EDITMODE block in sync)
applySummitTweaks(SUMMIT_TWEAK_DEFAULTS);

const summitTweakRoot = document.getElementById("tweaks-root");
if (summitTweakRoot) {
  ReactDOM.createRoot(summitTweakRoot).render(<SummitTweaksApp />);
}
