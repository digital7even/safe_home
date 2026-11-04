/*!
 * Safe Home Card – Dashboard-Karte für die Safe Home Alarmanlage
 * Mit ❤️ entwickelt in Deutschland von Digital7even
 * https://github.com/digital7even
 */
const SH_VERSION = "1.0.0";
// Build-Kennung aus der Lade-URL (zeigt, ob die aktuelle Datei wirklich geladen wurde)
const SH_BUILD = (() => {
  try {
    return (new URL(import.meta.url).searchParams.get("v") || "").split("-")[1] || "dev";
  } catch (e) {
    return "dev";
  }
})();
const LOGO_URL = new URL("./logo-white.png", import.meta.url).href;

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
  away: '<path d="M12 3 20 6v6c0 5-3.5 8.2-8 9.3C7.5 20.2 4 17 4 12V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10.2 11V9.4a1.8 1.8 0 0 1 3.6 0V11"/>',
  night: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  alarm: '<path d="M6.5 18v-5.5a5.5 5.5 0 0 1 11 0V18"/><path d="M4 18h16v3H4z"/><path d="M12 2v2.2M4.4 5.4l1.5 1.5M19.6 5.4l-1.5 1.5"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9.5 4 5M21 9.5l-4 5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  door: '<path d="M6 21V3h12v18"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".6" fill="currentColor"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.8 2.8L16 9.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  warn: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.2M12 17.2v.3"/>',
  bypass: '<path d="M4 12h5M15 12h5"/><path d="M9 12a3 3 0 0 1 6 0"/><circle cx="12" cy="12" r="9"/>',
  back: '<path d="M9 5h11v14H9l-6-7z"/><path d="m12 9.5 5 5M17 9.5l-5 5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  sos: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.3v.3"/>',
};
Object.assign(ICONS, {
  drop: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  gauge: '<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="m12 13 3.5-4"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  stop: '<rect x="7" y="7" width="10" height="10" rx="2"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M3 21h13"/><path d="M7 7h5v4H7z"/><path d="M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
  code: '<path d="M8 7 3 12l5 5"/><path d="M16 7l5 5-5 5"/><path d="M13.5 5 10.5 19"/>',
  grip: '<circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="15" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="18" r="1.2" fill="currentColor"/><circle cx="15" cy="18" r="1.2" fill="currentColor"/>',
  camera: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/>',
});

const WEATHER_DE = {
  "clear-night": "Klar", cloudy: "Bewölkt", exceptional: "Unwetter", fog: "Nebel", hail: "Hagel",
  lightning: "Gewitter", "lightning-rainy": "Gewitter mit Regen", partlycloudy: "Teilweise bewölkt",
  pouring: "Starkregen", rainy: "Regen", snowy: "Schnee", "snowy-rainy": "Schneeregen", sunny: "Sonnig",
  windy: "Windig", "windy-variant": "Windig & bewölkt",
};
const WX = {
  sun: '<circle cx="12" cy="12" r="4.2" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></g>',
  moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" fill="#c7d2fe"/>',
  cloud: (dy = 0, fill = "#dbe4ff") =>
    `<path transform="translate(0 ${dy})" d="M7.2 19h9.6a4 4 0 0 0 .6-7.96A5.6 5.6 0 0 0 6.9 10.4 4.3 4.3 0 0 0 7.2 19z" fill="${fill}"/>`,
  smallSun: '<g transform="translate(-3.2 -3.6) scale(.75)"><circle cx="12" cy="12" r="4.2" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><path d="M12 3v2M3 12h2M5.6 5.6l1.4 1.4M18.4 5.6 17 7"/></g></g>',
  rain: (n = 3) =>
    `<g stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round">${["8.5", "12", "15.5"].slice(0, n).map((x) => `<path d="M${x} 18.5l-1 2.8"/>`).join("")}</g>`,
  snow: '<g fill="#fff"><circle cx="8.5" cy="19.6" r="1"/><circle cx="12" cy="21" r="1"/><circle cx="15.5" cy="19.6" r="1"/></g>',
  bolt: '<path d="M12.8 14.5 10 19h3l-1.6 4 4.4-5.6h-3l1.4-2.9z" fill="#fbbf24"/>',
  fog: '<g stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round"><path d="M4 18h16M6 21h12"/></g>',
  wind: '<g stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M3 9h11a3 3 0 1 0-3-3M3 13h16a3 3 0 1 1-3 3M3 17h7"/></g>',
};
function weatherIcon(cond, big = false) {
  let g;
  switch (cond) {
    case "sunny": g = WX.sun; break;
    case "clear-night": g = WX.moon; break;
    case "partlycloudy": g = WX.smallSun + WX.cloud(1); break;
    case "cloudy": g = WX.cloud(0, "#b9c6e4"); break;
    case "fog": g = WX.cloud(-3, "#b9c6e4") + WX.fog; break;
    case "rainy": g = WX.cloud(-3) + WX.rain(2); break;
    case "pouring": g = WX.cloud(-3, "#b9c6e4") + WX.rain(3); break;
    case "snowy": g = WX.cloud(-3) + WX.snow; break;
    case "snowy-rainy": g = WX.cloud(-3) + WX.rain(1) + '<circle cx="15.5" cy="20" r="1" fill="#fff"/>'; break;
    case "hail": g = WX.cloud(-3) + WX.snow; break;
    case "lightning": g = WX.cloud(-4, "#b9c6e4") + WX.bolt; break;
    case "lightning-rainy": g = WX.cloud(-4, "#b9c6e4") + WX.bolt + WX.rain(1); break;
    case "windy": case "windy-variant": g = WX.wind; break;
    case "exceptional": g = '<path d="M12 3.5 21.5 20h-19z" fill="#fbbf24"/><path d="M12 10v4.2M12 17.2v.3" stroke="#0b2463" stroke-width="2" stroke-linecap="round"/>'; break;
    default: g = WX.cloud(0, "#b9c6e4");
  }
  return `<svg class="wxi ${big ? "big" : ""}" viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
}

const WIDGET_NAMES = {
  alarm: "Alarmanlage", people: "Personen", automation: "Automatik", panic: "Panik-Taste",
  weather: "Wetter", climate: "Raumklima", cameras: "Kameras", covers: "Rollos",
  lights: "Licht", scenes: "Szenen & Skripte", sensors: "Sensoren", events: "Protokoll",
  fuel: "Kraftstoffpreise",
  custom1: "Eigenes Widget 1", custom2: "Eigenes Widget 2", custom3: "Eigenes Widget 3", custom4: "Eigenes Widget 4",
};
const SH_EMBED_SLOTS = [1, 2, 3, 4];
/** Widget-Größen: Inhalt wird proportional skaliert, Raster ordnen sich automatisch neu an. */
const SH_SIZES = [
  { id: "xs", label: "Sehr klein", short: "XS", zoom: 0.72 },
  { id: "s", label: "Klein", short: "S", zoom: 0.86 },
  { id: "m", label: "Normal", short: "M", zoom: 1 },
  { id: "l", label: "Groß", short: "L", zoom: 1.15 },
];
function shSizeOf(c, id) {
  const v = c?.widget_sizes && typeof c.widget_sizes === "object" ? c.widget_sizes[id] : null;
  return SH_SIZES.some((x) => x.id === v) ? v : "m";
}
/** Größe eines Widgets um einen Schritt ändern – liefert das neue widget_sizes-Objekt. */
function shStepSize(c, id, dir) {
  const i = SH_SIZES.findIndex((x) => x.id === shSizeOf(c, id));
  const next = SH_SIZES[Math.max(0, Math.min(SH_SIZES.length - 1, i + dir))].id;
  const sizes = { ...(c?.widget_sizes && typeof c.widget_sizes === "object" ? c.widget_sizes : {}) };
  if (next === "m") delete sizes[id];
  else sizes[id] = next;
  for (const k of Object.keys(sizes)) if (!WIDGET_NAMES[k]) delete sizes[k];
  return sizes;
}
const SH_FUEL_MAX = 4;
const DEFAULT_ORDER = {
  a: ["alarm", "people", "automation", "panic"],
  b: ["weather", "climate", "fuel", "cameras", "custom1", "custom3"],
  c: ["covers", "lights", "scenes", "sensors", "events", "custom2", "custom4"],
};

const CUSTOM_DEFAULTS = {
  device: "auto",
  fullscreen: false,
  accent: "auto",
  show_clock: true,
  show_people: true,
  show_weather: true,
  show_forecast: true,
  forecast_days: 5,
  show_climate: true,
  show_covers: true,
  covers_group_by_area: true,
  show_cover_all: true,
  show_lights: true,
  show_scenes: true,
  show_cameras: true,
  camera_refresh: 10,
  show_fuel: true,
  fuel_sort: false,
  show_custom_1: false,
  show_custom_2: false,
  show_custom_3: false,
  show_custom_4: false,
};

const icon = (name, cls = "") =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

// ------------------------------------------------------------------ Hintergrundfarbe
// Farben der Schaltungen (fest berechnet – funktioniert auch in älteren App-Browsern ohne color-mix)
const TONE_RGB = {
  home: [52, 211, 153], away: [79, 141, 255], night: [167, 139, 250], arming: [59, 123, 255],
  pending: [251, 191, 36], alarm: [239, 41, 69], off: [100, 116, 139],
};
const shRgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.round(a * 1000) / 1000})`;
function shHsl(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function shRgbToHsl(rgb) {
  const [r, g, b] = rgb.map((v) => Math.max(0, Math.min(255, Number(v) || 0)) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Eigene Hintergrundfarbe (RGB-Regler) als Theme-Basis. Sehr helle Farben werden für lesbare Schrift abgedunkelt. */
function shColorBase(cfg) {
  const c = cfg.background_color;
  if (!Array.isArray(c) || c.length !== 3) return null;
  const { h, s, l } = shRgbToHsl(c);
  return { h, s: Math.min(85, s), l: Math.max(6, Math.min(32, l)) };
}

/** Theme-Variablen aus Farbton/Sättigung/Helligkeit. */
function shThemeVars(base, cfg) {
  const { h, s } = base;
  const L = base.l ?? 17;
  const bg2 = shHsl(h, s, L);
  const bg1 = shHsl(h, Math.round(s * 0.9), Math.max(3, Math.round(L * 0.42)));
  const vars = {
    "--sh-bg1": shRgba(bg1, 1),
    "--sh-bg2": shRgba(bg2, 1),
    "--sh-line": shRgba(shHsl(h, Math.min(70, s + 20), 82), 0.2),
    "--sh-muted": shRgba(shHsl(h, Math.max(14, Math.round(s * 0.6)), 78), 1),
    "--sh-surface": shRgba(shHsl(h, Math.min(50, s), 92), 0.08),
    "--sh-surface2": shRgba(shHsl(h, Math.min(50, s), 92), 0.13),
  };
  if ((cfg.accent || "auto") === "auto" && s >= 12) {
    // Rottöne sind für den Alarm reserviert -> warmes Bernstein statt Rot
    const ah = h >= 330 || h < 22 ? 32 : h;
    vars["--sh-accent"] = shRgba(shHsl(ah, Math.max(s, 72), 56), 1);
  }
  return { vars, bg1, bg2, glow: shHsl(h, Math.min(80, s + 10), Math.min(45, L + 14)) };
}

/** Kartenhintergrund mit eigener Farbe (RGB-Regler). */
function shColorCard(cfg) {
  const base = shColorBase(cfg);
  if (!base) return "";
  const t = shThemeVars(base, cfg);
  const vars = Object.entries(t.vars).map(([k, v]) => `${k}:${v}`).join(";");
  return `${vars};background:radial-gradient(120% 80% at 100% 0%, ${shRgba(t.glow, 0.85)} 0%, ${shRgba(t.glow, 0)} 55%), linear-gradient(160deg, ${shRgba(t.bg2, 1)}, ${shRgba(t.bg1, 1)} 70%)`;
}

const STATE_INFO = {
  disarmed: { label: "Zuhause", sub: "Alarmanlage unscharf", icon: "home", tone: "home" },
  armed_away: { label: "Unterwegs", sub: "Alle Sensoren scharf", icon: "away", tone: "away" },
  armed_night: { label: "Nacht", sub: "Nachtsensoren scharf", icon: "night", tone: "night" },
  arming: { label: "Wird scharf", sub: "Ausgangsverzögerung", icon: "clock", tone: "arming" },
  pending: { label: "Bitte entschärfen", sub: "Eingangsverzögerung", icon: "warn", tone: "pending" },
  triggered: { label: "ALARM", sub: "Einbruch erkannt", icon: "alarm", tone: "alarm" },
  unavailable: { label: "Nicht verfügbar", sub: "Integration prüfen", icon: "warn", tone: "off" },
};
const MODE_LABEL = { away: "Unterwegs", night: "Nacht", disarmed: "Zuhause" };
const EVENT_TONE = {
  armed: "away", disarmed: "home", triggered: "alarm", pending: "pending",
  arming: "arming", warning: "pending", bypass: "pending", info: "info",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);


const STYLE = `
:host{
  --sh-bg1:#071538; --sh-bg2:#0b2463; --sh-surface:rgba(255,255,255,.06); --sh-surface2:rgba(255,255,255,.1);
  --sh-line:rgba(160,190,255,.16); --sh-text:#eef3ff; --sh-muted:#9fb1d9; --sh-accent:#3b7bff;
  --sh-home:#34d399; --sh-away:#4f8dff; --sh-night:#a78bfa; --sh-pending:#fbbf24; --sh-alarm:#ef2945;
  --tone:var(--sh-home);
  display:block;
}
ha-card{display:block; container:sh / inline-size; position:relative; overflow:hidden; padding:18px 18px 12px; color:var(--sh-text);
  background:radial-gradient(120% 80% at 100% 0%, #123a9a 0%, transparent 55%), linear-gradient(160deg,var(--sh-bg2),var(--sh-bg1) 70%);
  border:1px solid var(--sh-line); border-radius:var(--ha-card-border-radius,20px); box-shadow:0 10px 30px rgba(3,10,35,.45);
  font-family:var(--ha-font-family-body, "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);}
.tone-home{--tone:var(--sh-home)} .tone-away{--tone:var(--sh-away)} .tone-night{--tone:var(--sh-night)}
.tone-arming{--tone:var(--sh-accent)} .tone-pending{--tone:var(--sh-pending)} .tone-alarm{--tone:var(--sh-alarm)} .tone-off{--tone:#64748b}
.glow{position:absolute; inset:-40% -20% auto auto; width:70%; height:90%; max-width:520px; max-height:520px; background:radial-gradient(closest-side, color-mix(in srgb,var(--tone) 30%, transparent), transparent); pointer-events:none; transition:background .4s}
@media (hover:hover) and (pointer:fine){ .tone-alarm .glow{animation:pulse 1s ease-in-out infinite alternate} }
@media not ((hover:hover) and (pointer:fine)){ .tone-alarm .glow{opacity:1} }
@keyframes pulse{from{opacity:.4}to{opacity:1}}
.ic{width:22px; height:22px; flex:none}
header{position:relative; display:flex; align-items:center; gap:12px}
.logo{width:42px; height:42px; object-fit:contain; filter:drop-shadow(0 3px 8px rgba(0,0,0,.45))}
.ttl{flex:1; min-width:0}
.ttl h2{margin:0; font-size:1.15rem; font-weight:700; letter-spacing:.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.ttl span{font-size:.78rem; color:var(--sh-muted); text-transform:uppercase; letter-spacing:1.4px}
.pill{font-size:.75rem; font-weight:600; padding:5px 10px; border-radius:999px; color:var(--tone); background:color-mix(in srgb,var(--tone) 16%, transparent); border:1px solid color-mix(in srgb,var(--tone) 40%, transparent); white-space:nowrap}
.hero{position:relative; display:flex; align-items:center; gap:18px; margin:20px 0 16px}
.ring{position:relative; width:104px; height:104px; flex:none}
.ring > svg{width:100%; height:100%; transform:rotate(-90deg)}
.ring > svg circle{fill:none; stroke-width:7}
.ring-bg{stroke:rgba(255,255,255,.08)}
.ring-full{stroke:var(--tone); opacity:.9}
.ring-prog{stroke:var(--tone); stroke-linecap:round; stroke-dasharray:339.3; transition:stroke-dashoffset 1s linear}
.ring-ic{position:absolute; inset:0; display:grid; place-items:center; color:var(--tone)}
.ring-ic .ic{width:40px; height:40px; stroke-width:1.6}
.tone-alarm .ring-ic{animation:shake .5s ease-in-out infinite}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
.hero-txt{min-width:0}
.state{font-size:1.75rem; font-weight:800; line-height:1.1; letter-spacing:-.3px}
.tone-alarm .state{color:var(--sh-alarm)}
.sub{margin-top:4px; color:var(--sh-muted); font-size:.92rem}
.count{display:inline-block; margin-left:4px; font-weight:800; color:var(--tone); font-variant-numeric:tabular-nums; font-size:1.05rem}
.by{margin-top:6px; font-size:.75rem; color:var(--sh-muted); opacity:.8}
.modes{position:relative; display:grid; grid-template-columns:repeat(3,1fr); gap:10px}
.mode{all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:7px; padding:14px 6px 12px; border-radius:16px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-muted); transition:all .2s; text-align:center}
.mode:hover:not([disabled]){background:var(--sh-surface2); color:var(--sh-text)}
.mode:focus-visible{outline:2px solid var(--sh-accent); outline-offset:2px}
.mode[disabled]{opacity:.35; cursor:not-allowed}
.mode-ic{display:grid; place-items:center; width:42px; height:42px; border-radius:13px; background:rgba(255,255,255,.06)}
.mode-label{font-size:.86rem; font-weight:600}
.mode.active{color:#fff; border-color:transparent}
.mode.active.m-disarm{background:linear-gradient(150deg,#10b981,#047857); box-shadow:0 6px 18px rgba(16,185,129,.35)}
.mode.active.m-away{background:linear-gradient(150deg,#3b7bff,#1d3fb8); box-shadow:0 6px 18px rgba(59,123,255,.4)}
.mode.active.m-night{background:linear-gradient(150deg,#8b5cf6,#4c1d95); box-shadow:0 6px 18px rgba(139,92,246,.35)}
.mode.active .mode-ic{background:rgba(255,255,255,.18)}
.alarm-actions{display:flex; gap:10px; margin-bottom:12px}
.big{all:unset; box-sizing:border-box; cursor:pointer; flex:1; display:flex; justify-content:center; align-items:center; gap:8px; padding:13px; border-radius:14px; font-weight:700; font-size:.95rem}
.big.solid{background:#fff; color:#0b2463}
.big.ghost{background:rgba(239,41,69,.18); color:#ffd2d8; border:1px solid rgba(239,41,69,.5)}
.autorow{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px}
.tog{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:8px; padding:11px 10px; border-radius:14px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-muted); min-width:0}
.tog span{flex:1; display:flex; flex-direction:column; min-width:0}
.tog b{font-size:.85rem; color:var(--sh-text); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.tog small{font-size:.72rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.tog.on{color:color-mix(in srgb, var(--sh-accent) 55%, #fff); border-color:color-mix(in srgb, var(--sh-accent) 55%, transparent); background:color-mix(in srgb, var(--sh-accent) 14%, transparent)}
.sw{position:relative; width:32px; height:18px; border-radius:99px; background:rgba(255,255,255,.15); flex:none; transition:background .2s}
.sw::after{content:""; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#cbd5e1; transition:transform .2s}
.tog.on .sw{background:var(--sh-accent)} .tog.on .sw::after{transform:translateX(14px); background:#fff}
.people{display:flex; align-items:center; gap:6px; margin-top:10px}
.pp{width:28px; height:28px; border-radius:50%; display:grid; place-items:center; font-size:.75rem; font-weight:700; background:rgba(255,255,255,.08); color:var(--sh-muted); border:2px solid rgba(255,255,255,.12); overflow:hidden; filter:grayscale(1); opacity:.6}
.pp img{width:100%; height:100%; object-fit:cover}
.pp.home{border-color:var(--sh-home); color:#fff; filter:none; opacity:1}
.people .muted{margin-left:4px}
.section{margin-top:16px}
.sec-head{display:flex; justify-content:space-between; align-items:baseline; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--sh-muted); margin-bottom:8px}
.muted{color:var(--sh-muted); font-size:.78rem; font-weight:500; text-transform:none; letter-spacing:0}
.small{font-size:.8rem}
.chips{display:flex; flex-wrap:wrap; gap:6px}
.chip{display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:10px; font-size:.82rem; background:rgba(251,191,36,.12); border:1px solid rgba(251,191,36,.35); color:#fde68a}
.chip .ic{width:16px; height:16px}
.chip em{font-style:normal; font-size:.7rem; opacity:.75}
.chip.by{background:rgba(148,163,184,.12); border-color:rgba(148,163,184,.35); color:#cbd5e1}
.allok{display:flex; align-items:center; gap:8px; font-size:.86rem; color:#a7f3d0}
.allok .ic{width:18px; height:18px; color:var(--sh-home)}
.events{list-style:none; margin:0; padding:0}
.events li{display:flex; align-items:center; gap:10px; padding:7px 0; border-top:1px solid var(--sh-line); font-size:.84rem}
.events li:first-child{border-top:none}
.ev-msg{flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.events time{color:var(--sh-muted); font-size:.75rem; font-variant-numeric:tabular-nums; flex:none}
.dot{width:8px; height:8px; border-radius:50%; flex:none; background:#64748b}
.t-home{background:var(--sh-home)} .t-away{background:var(--sh-away)} .t-alarm{background:var(--sh-alarm); box-shadow:0 0 8px var(--sh-alarm)}
.t-pending{background:var(--sh-pending)} .t-arming{background:var(--sh-accent)} .t-info{background:#7c8db5}
.panic{all:unset; box-sizing:border-box; position:relative; overflow:hidden; cursor:pointer; margin-top:16px; width:100%; display:flex; justify-content:center; align-items:center; gap:8px; padding:11px; border-radius:14px; font-size:.82rem; font-weight:600; color:#ffb4bf; background:rgba(239,41,69,.08); border:1px dashed rgba(239,41,69,.45); user-select:none; -webkit-user-select:none; touch-action:none}
.panic .ic{width:18px; height:18px}
.panic span,.panic .ic{position:relative; z-index:1}
.panic .fill{position:absolute; inset:0; width:0; background:rgba(239,41,69,.55)}
.panic.holding .fill{width:100%; transition:width 2s linear}
.overlay{position:absolute; inset:0; z-index:5; display:grid; place-items:center; background:rgba(3,10,35,.86); padding:16px}
.pad{width:100%; max-width:290px; background:linear-gradient(160deg,#0f2b72,#081a46); border:1px solid var(--sh-line); border-radius:20px; padding:16px; box-shadow:0 20px 50px rgba(0,0,0,.5); display:flex; flex-direction:column; gap:12px}
.pad-head{display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:.92rem}
.x{all:unset; cursor:pointer; color:var(--sh-muted); display:grid}
.dots{height:26px; display:flex; justify-content:center; align-items:center; gap:10px}
.dots i{width:12px; height:12px; border-radius:50%; background:#fff}
.keys{display:grid; grid-template-columns:repeat(3,1fr); gap:8px}
.keys button{all:unset; box-sizing:border-box; cursor:pointer; display:grid; place-items:center; height:52px; border-radius:14px; background:var(--sh-surface); border:1px solid var(--sh-line); font-size:1.3rem; font-weight:600; color:var(--sh-text)}
.keys button:active{background:var(--sh-surface2)}
.keys .ok{background:var(--sh-accent); border-color:transparent; font-size:1rem}
.codein{all:unset; box-sizing:border-box; width:100%; padding:12px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-text); text-align:center; font-size:1.1rem}
.toast{position:absolute; left:16px; right:16px; bottom:16px; z-index:6; display:flex; align-items:center; gap:8px; padding:11px 14px; border-radius:12px; background:#ef2945; color:#fff; font-weight:600; font-size:.86rem; box-shadow:0 8px 24px rgba(0,0,0,.4)}
.toast .ic{width:18px; height:18px}
.toast.ok{background:#047857}
@media (max-width:380px){ .state{font-size:1.45rem} .ring{width:86px;height:86px} .tog small{display:none} }
`;

const STYLE_COMPACT = `
ha-card.l-compact{padding:14px}
.l-compact .glow{width:55%; height:140%; inset:-60% -15% auto auto}
.c-head{position:relative; display:flex; align-items:center; gap:12px; margin-bottom:12px}
.c-ic{display:grid; place-items:center; width:46px; height:46px; border-radius:14px; flex:none; color:var(--tone); background:color-mix(in srgb,var(--tone) 16%, transparent); border:1px solid color-mix(in srgb,var(--tone) 40%, transparent)}
.c-ic .ic{width:26px; height:26px}
.tone-alarm .c-ic{animation:pulse .8s ease-in-out infinite alternate}
.c-txt{flex:1; min-width:0}
.c-title{display:flex; align-items:center; gap:6px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:1.3px; color:var(--sh-muted)}
.c-logo{width:15px; height:15px; object-fit:contain}
.c-state{font-size:1.15rem; font-weight:800; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.tone-alarm .c-state{color:var(--sh-alarm)}
.c-sub{margin-left:8px; font-size:.8rem; font-weight:500; color:var(--sh-muted)}
.c-sub .count{font-size:.85rem}
.c-mute{all:unset; cursor:pointer; display:grid; place-items:center; width:40px; height:40px; border-radius:12px; background:rgba(239,41,69,.2); color:#ffd2d8; border:1px solid rgba(239,41,69,.5)}
.c-bar{position:relative; height:4px; border-radius:4px; background:rgba(255,255,255,.08); margin:-4px 0 12px; overflow:hidden}
.c-bar i{position:absolute; inset:0 auto 0 0; background:var(--tone); border-radius:4px; transition:width 1s linear}
.l-compact .modes{gap:8px}
.l-compact .mode{flex-direction:row; justify-content:center; gap:8px; padding:9px 6px; border-radius:13px}
.l-compact .mode-ic{width:28px; height:28px; border-radius:9px}
.l-compact .mode-ic .ic{width:18px; height:18px}
.l-compact .mode-label{font-size:.82rem}
.l-compact .overlay{padding:8px}
.l-compact .pad{padding:12px; gap:8px}
.l-compact .keys button{height:40px}
@container sh (max-width:330px){ .l-compact .mode{flex-direction:column; gap:4px} .c-sub{display:block; margin-left:0} }
`;

const STYLE_TABLET = `
ha-card.l-tablet{padding:22px 22px 14px}
.l-tablet .logo{width:52px; height:52px}
.l-tablet .ttl h2{font-size:1.4rem}
.l-tablet .pill{font-size:.85rem; padding:7px 14px}
.tb-grid{position:relative; display:grid; grid-template-columns:1fr; gap:18px; margin-top:18px}
.tb-col{display:flex; flex-direction:column; gap:16px; min-width:0}
.tb-box{background:rgba(255,255,255,.04); border:1px solid var(--sh-line); border-radius:18px; padding:16px}
.tb-box .section{margin-top:0}
.tb-box .autorow{margin-top:0}
@container sh (min-width:680px){ .l-tablet .autorow{grid-template-columns:1fr} }
.tb-main{justify-content:flex-start}
.l-tablet .hero{margin:4px 0 0; gap:24px}
.l-tablet .ring{width:150px; height:150px}
.l-tablet .ring-ic .ic{width:58px; height:58px}
.l-tablet .state{font-size:2.4rem}
.l-tablet .sub{font-size:1.05rem}
.l-tablet .count{font-size:1.3rem}
.l-tablet .alarm-actions{margin:0}
.l-tablet .big{padding:18px; font-size:1.05rem}
.l-tablet .modes{gap:14px}
.l-tablet .mode{padding:22px 8px 18px; border-radius:20px; gap:10px}
.l-tablet .mode-ic{width:60px; height:60px; border-radius:18px}
.l-tablet .mode-ic .ic{width:30px; height:30px}
.l-tablet .mode-label{font-size:1.05rem}
.l-tablet .panic{margin-top:0; padding:15px}
.l-tablet .tog{padding:14px}
.l-tablet .events li{padding:10px 0; font-size:.92rem}
.l-tablet .pp{width:34px; height:34px}
.l-tablet .keys button{height:62px; font-size:1.5rem}
.l-tablet .pad{max-width:340px}
@container sh (min-width:680px){
  .tb-grid{grid-template-columns:1.1fr 1fr}
  .tb-log{grid-column:1 / -1}
}
@container sh (min-width:1060px){
  .tb-grid{grid-template-columns:1.25fr 1fr 1fr}
  .tb-log{grid-column:auto}
  .l-tablet .ring{width:170px; height:170px}
}
`;

const STYLE_CUSTOM = `
ha-card.l-custom{padding:20px 20px 18px}
.acc-indigo{--sh-accent:#6366f1} .acc-cyan{--sh-accent:#06b6d4} .acc-emerald{--sh-accent:#10b981} .acc-red{--sh-accent:#ef2945} .acc-amber{--sh-accent:#f59e0b}
ha-card.fs{min-height:100vh; min-height:100dvh; border-radius:0; border:none; box-shadow:none; box-sizing:border-box;
  padding:max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))}
.cu-head{gap:14px}
.l-custom .logo{width:48px; height:48px}
.l-custom .ttl h2{font-size:1.3rem}
.l-custom .ttl span{text-transform:none; letter-spacing:.2px; font-size:.85rem}
.cu-time{font-size:2rem; font-weight:800; letter-spacing:-.5px; font-variant-numeric:tabular-nums; color:#fff}
.cu-grid{position:relative; display:grid; gap:16px; margin-top:18px; grid-template-columns:minmax(0,1fr); grid-template-areas:"a" "b" "c"}
.cu-grid.hp .people{display:none}
.cu-col{display:flex; flex-direction:column; gap:16px; min-width:0}
.cu-col:empty{display:none}
.cu-w{position:relative; min-width:0}
.editing .cu-col{min-height:90px; border-radius:20px; outline:2px dashed rgba(160,190,255,.22); outline-offset:6px}
.editing .cu-col:empty{display:block}
.editing .cu-w{border-radius:20px; padding:8px; background:rgba(255,255,255,.02); outline:1.5px dashed rgba(160,190,255,.35); outline-offset:0}
.editing .cu-w > :not(.cu-tools){pointer-events:none}
.cu-body{min-width:0}
.cu-w[data-size="xs"] > .cu-body{zoom:.72}
.cu-w[data-size="s"] > .cu-body{zoom:.86}
.cu-w[data-size="l"] > .cu-body{zoom:1.15}
.cu-tools{position:relative; z-index:3; display:flex; gap:6px; margin-bottom:8px; align-items:stretch}
.cu-size{flex:none; display:flex; align-items:center; gap:2px; padding:2px; border-radius:12px; background:rgba(255,255,255,.08); border:1px solid var(--sh-line)}
.cu-size button{all:unset; box-sizing:border-box; cursor:pointer; width:32px; height:100%; min-height:32px; display:grid; place-items:center; border-radius:9px; color:#fff; font-size:1.1rem; font-weight:700; line-height:1}
.cu-size button:hover{background:rgba(255,255,255,.12)}
.cu-size button[disabled]{opacity:.3; cursor:default; background:none}
.cu-size span{min-width:26px; text-align:center; font-size:.72rem; font-weight:800; letter-spacing:.5px; color:var(--sh-text)}
.cu-handle{all:unset; box-sizing:border-box; cursor:grab; touch-action:none; user-select:none; -webkit-user-select:none; position:relative; z-index:3; flex:1; min-width:0; display:flex; justify-content:center; align-items:center; gap:6px; padding:8px 10px; border-radius:12px; font-size:.78rem; font-weight:700; color:#fff; background:color-mix(in srgb,var(--sh-accent) 70%, transparent); border:1px solid color-mix(in srgb,var(--sh-accent) 90%, #fff 10%)}
.cu-handle:hover{background:var(--sh-accent)}
.cu-handle:active{cursor:grabbing}
.cu-handle .ic{width:18px; height:18px}
.cu-ghost{position:absolute; z-index:20; pointer-events:none; opacity:.92; transform:rotate(1.5deg) scale(1.02); box-shadow:0 24px 50px rgba(0,0,0,.55); border-radius:20px; background:var(--sh-bg2)}
.cu-ph{border-radius:20px; border:2px dashed var(--sh-accent); background:color-mix(in srgb,var(--sh-accent) 10%, transparent)}
.cu-edit-hint{position:relative; display:flex; align-items:center; gap:8px; margin-top:14px; padding:10px 14px; border-radius:12px; font-size:.84rem; color:#dbe7ff; background:color-mix(in srgb,var(--sh-accent) 18%, transparent); border:1px solid color-mix(in srgb,var(--sh-accent) 45%, transparent)}
.cu-edit-hint .ic{width:18px; height:18px}
.cu-a{grid-area:a} .cu-b{grid-area:b} .cu-c{grid-area:c}
.d-phone .cu-head, .d-phone .cu-grid{max-width:620px; margin-left:auto; margin-right:auto}
.d-phone .cu-head{display:flex}
@container sh (min-width:720px){
  .d-auto .cu-grid, .d-tablet .cu-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); grid-template-areas:"a b" "a c"; align-items:start}
}
@container sh (min-width:1100px){
  .d-auto .cu-grid, .d-tablet .cu-grid{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) minmax(0,1fr); grid-template-areas:"a b c"}
}
@container sh (max-width:440px){ .l-custom .pill{display:none} .cu-time{font-size:1.6rem} .l-custom .autorow{grid-template-columns:1fr} }
.l-custom .glow{width:520px; height:520px; inset:-220px -180px auto auto; background:radial-gradient(closest-side, color-mix(in srgb,var(--tone) 28%, transparent), transparent)}
.cu-alarm{display:flex; flex-direction:column; gap:14px; background:rgba(255,255,255,.04); border:1px solid var(--sh-line); border-radius:20px; padding:16px}
.l-custom .hero{margin:0; gap:20px}
.l-custom .ring{width:120px; height:120px}
.l-custom .ring-ic .ic{width:46px; height:46px}
.l-custom .state{font-size:2rem}
.l-custom .alarm-actions{margin:0}
.l-custom .mode{padding:18px 6px 14px; border-radius:18px}
.l-custom .mode-ic{width:50px; height:50px; border-radius:15px}
.l-custom .mode-ic .ic{width:26px; height:26px}
.l-custom .mode-label{font-size:.95rem}
.l-custom .panic{margin-top:0; padding:14px}
.d-tablet .ring{width:150px; height:150px} .d-tablet .state{font-size:2.4rem} .d-tablet .mode{padding:24px 8px 18px}
.d-tablet .mode-ic{width:60px; height:60px} .d-tablet .keys button{height:62px; font-size:1.5rem} .d-tablet .pad{max-width:340px}
.d-phone .ring{width:96px; height:96px} .d-phone .ring-ic .ic{width:38px; height:38px} .d-phone .state{font-size:1.65rem}
.cu-box{padding:16px}
.cu-box .sec-head{margin-bottom:12px}
.tog{min-height:52px}
/* Personen */
.people-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(92px,1fr)); gap:10px}
.person{all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; align-items:center; text-align:center; gap:3px; padding:12px 6px 10px; border-radius:16px; background:rgba(255,255,255,.04); border:1px solid transparent; min-width:0}
.person.home{background:rgba(52,211,153,.08); border-color:rgba(52,211,153,.3)}
.av{position:relative; width:64px; height:64px; border-radius:50%; display:grid; place-items:center; font-size:1.5rem; font-weight:800; color:#fff; background:linear-gradient(150deg,#2a4a9a,#16306e); border:3px solid rgba(255,255,255,.14); margin-bottom:6px}
.av img{width:100%; height:100%; object-fit:cover; border-radius:50%}
.person:not(.home) .av{filter:grayscale(.9); opacity:.6}
.person.home .av{border-color:var(--sh-home); box-shadow:0 0 0 4px rgba(52,211,153,.18), 0 6px 18px rgba(16,185,129,.3)}
.badge{position:absolute; right:-4px; bottom:-4px; width:24px; height:24px; border-radius:50%; display:grid; place-items:center; background:#334155; border:2px solid var(--sh-bg2); color:#fff}
.badge .ic{width:13px; height:13px; stroke-width:2.2}
.person.home .badge{background:var(--sh-home)}
.person b{font-size:.92rem; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.person small{font-size:.75rem; color:var(--sh-muted); max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.person.home small{color:#6ee7b7}
.person em{font-style:normal; font-size:.68rem; color:var(--sh-muted); opacity:.75}
/* Wetter */
.wx{all:unset; box-sizing:border-box; cursor:pointer; width:100%; display:flex; align-items:center; gap:14px; flex-wrap:wrap}
.wxi{width:28px; height:28px} .wxi.big{width:68px; height:68px; filter:drop-shadow(0 4px 12px rgba(0,0,0,.3))}
.wx-main{display:flex; flex-direction:column}
.wx-main b{font-size:2.5rem; font-weight:800; line-height:1; letter-spacing:-1px}
.wx-main sup{font-size:1rem; font-weight:600; margin-left:2px; vertical-align:top; letter-spacing:0}
.wx-main small{color:var(--sh-muted); font-size:.9rem; margin-top:4px}
.wx-det{margin-left:auto; display:flex; flex-direction:column; gap:5px; font-size:.82rem; color:var(--sh-muted)}
.wx-det span{display:flex; align-items:center; gap:6px}
.wx-det .ic{width:16px; height:16px}
.fc{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); gap:4px; margin-top:14px; padding-top:12px; border-top:1px solid var(--sh-line)}
.fc-d{display:flex; flex-direction:column; align-items:center; gap:3px; font-size:.8rem; min-width:0}
.fc-d .ic, .fc-d svg{max-width:100%}
.fc-d small{color:var(--sh-muted); text-transform:capitalize}
.fc-d b{font-size:.95rem}
.fc-d em{font-style:normal; color:var(--sh-muted); font-size:.75rem}
.fc-d i{font-style:normal; color:#93c5fd; font-size:.7rem}
/* Raumklima */
.clim-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(128px,1fr)); gap:10px}
.clim{all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; gap:6px; padding:12px; border-radius:14px; background:rgba(255,255,255,.05); border:1px solid var(--sh-line); border-left:3px solid #64748b; min-width:0}
.clim.ok{border-left-color:var(--sh-home)} .clim.cold{border-left-color:#60a5fa} .clim.warm{border-left-color:#fb923c}
.clim small{font-size:.75rem; color:var(--sh-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.clim-v{display:flex; align-items:center; gap:4px}
.clim-v .ic{width:18px; height:18px; color:var(--sh-muted)}
.clim-v b{font-size:1.5rem; font-weight:800}
.clim-v sup{font-size:.75rem; color:var(--sh-muted); align-self:flex-start; margin-top:4px}
.clim-h{display:flex; align-items:center; gap:5px; font-size:.82rem; color:#93c5fd}
.clim-h .ic{width:14px; height:14px}
.clim-h.warn{color:var(--sh-pending)}
/* Rollos */
.cov-room + .cov-room{margin-top:12px}
.cov-room-h{display:flex; justify-content:space-between; align-items:center; font-size:.78rem; font-weight:700; color:#c7d6ff; margin-bottom:6px}
.mini{display:flex; gap:4px}
.mini button{all:unset; cursor:pointer; display:grid; place-items:center; width:28px; height:24px; border-radius:8px; background:rgba(255,255,255,.06); color:var(--sh-muted)}
.mini .ic{width:15px; height:15px}
.cov{display:flex; align-items:center; gap:10px; padding:8px 0; border-top:1px solid var(--sh-line)}
.cov-room-h + .cov{border-top:none}
.cov-name{all:unset; cursor:pointer; flex:1; min-width:0; display:flex; flex-direction:column; gap:3px}
.cov-name b{font-size:.9rem; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.cov-name small{font-size:.74rem; color:var(--sh-muted)}
.cov-bar{position:relative; display:block; height:4px; border-radius:4px; background:rgba(255,255,255,.08); overflow:hidden; margin-top:2px}
.cov-bar i{position:absolute; inset:0 auto 0 0; background:var(--sh-accent); border-radius:4px}
.cov-btns{display:flex; gap:6px}
.cov-btns button{all:unset; box-sizing:border-box; cursor:pointer; display:grid; place-items:center; width:42px; height:42px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-text)}
.cov-btns button:active, .cov-btns button.act{background:var(--sh-accent); border-color:transparent}
.cov-btns .ic{width:20px; height:20px; stroke-width:2.2}
.d-tablet .cov-btns button{width:50px; height:50px}
.cov-all{display:flex; gap:6px; text-transform:none; letter-spacing:0}
.cov-all button, .link{all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:3px; padding:4px 10px 4px 6px; border-radius:9px; font-size:.75rem; font-weight:600; color:#fff; background:color-mix(in srgb,var(--sh-accent) 35%, transparent); border:1px solid color-mix(in srgb,var(--sh-accent) 55%, transparent)}
.link{padding:4px 10px; text-transform:none; letter-spacing:0}
.cov-all .ic{width:14px; height:14px; stroke-width:2.4}
/* Licht */
.lt-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px}
.lt{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; padding:12px; border-radius:14px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-muted); min-width:0}
.lt span{display:flex; flex-direction:column; min-width:0}
.lt b{font-size:.85rem; color:var(--sh-text); font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.lt small{font-size:.72rem}
.lt.on{background:rgba(251,191,36,.14); border-color:rgba(251,191,36,.45); color:#fbbf24}
.lt.on .ic{filter:drop-shadow(0 0 6px rgba(251,191,36,.6))}
/* Szenen */
.scn-wrap{display:flex; flex-wrap:wrap; gap:8px}
.scn{all:unset; box-sizing:border-box; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; font-size:.86rem; font-weight:600; background:color-mix(in srgb,var(--sh-accent) 16%, transparent); border:1px solid color-mix(in srgb,var(--sh-accent) 40%, transparent); color:#fff}
.scn .ic{width:18px; height:18px; color:color-mix(in srgb,var(--sh-accent) 60%, #fff)}
.scn:active{background:var(--sh-accent)}
/* Kameras */
.cam-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px}
.camt{all:unset; cursor:pointer; position:relative; display:block; aspect-ratio:16/9; border-radius:14px; overflow:hidden; background:#050d24; border:1px solid var(--sh-line)}
.cam{width:100%; height:100%; object-fit:cover; display:block}
.cam-off{position:absolute; inset:0; display:grid; place-items:center; color:var(--sh-muted)}
.cam-l{position:absolute; left:0; right:0; bottom:0; padding:18px 10px 7px; font-size:.78rem; font-weight:600; background:linear-gradient(transparent, rgba(0,0,0,.7))}
/* Kraftstoffpreise */
.fuel-list{display:flex; flex-direction:column; gap:8px}
.fuel{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; background:var(--sh-surface); border:1px solid var(--sh-line); min-width:0; width:100%}
.fuel-logo{flex:none; width:40px; height:40px; border-radius:12px; display:grid; place-items:center; background:rgba(79,141,255,.14); color:#8fb3ff}
.fuel-logo .ic{width:22px; height:22px}
.fuel-info{flex:1; min-width:0; display:flex; flex-direction:column; gap:2px}
.fuel-info b{font-size:.92rem; font-weight:600; color:var(--sh-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.fuel-info small{font-size:.74rem; color:var(--sh-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.fuel-tags{display:flex; flex-wrap:wrap; gap:4px; margin-top:3px}
.fuel-tags:empty{display:none}
.fuel-tags i{font-style:normal; font-size:.64rem; font-weight:700; letter-spacing:.4px; text-transform:uppercase; padding:2px 7px; border-radius:999px; background:var(--sh-surface2); color:var(--sh-muted)}
.fuel-tags .fuel-best{background:rgba(52,211,153,.16); color:#34d399}
.fuel-tags .fuel-closed{background:rgba(239,41,69,.14); color:#fca5a5}
.fuel-price{flex:none; display:flex; align-items:flex-start; color:var(--sh-text); font-variant-numeric:tabular-nums; line-height:1}
.fuel-price b{font-size:1.65rem; font-weight:700; letter-spacing:-.5px}
.fuel-price b.na{color:var(--sh-muted)}
.fuel-price sup{font-size:.85rem; font-weight:700; margin:1px 0 0 1px; line-height:1}
.fuel-price small{align-self:flex-end; font-size:.82rem; color:var(--sh-muted); margin:0 0 2px 4px}
.fuel.best{border-color:rgba(52,211,153,.5); background:rgba(52,211,153,.08)}
.fuel.best .fuel-logo{background:rgba(52,211,153,.18); color:#34d399}
.fuel.best .fuel-price b, .fuel.best .fuel-price sup{color:#6ee7b7}
.fuel.closed{opacity:.55}
.fuel-upd{font-size:.7rem; font-weight:600; letter-spacing:.3px; text-transform:none}
.d-tablet .fuel-price b{font-size:1.9rem}
/* Eigene Widgets (eingebettete Dashboard-Karten) */
.cu-embed{min-width:0; color:var(--sh-text);
  --ha-card-background:rgba(255,255,255,.04); --card-background-color:var(--sh-bg2); --ha-card-border-color:var(--sh-line);
  --ha-card-border-width:1px; --ha-card-border-radius:18px; --ha-card-box-shadow:none;
  --primary-text-color:var(--sh-text); --secondary-text-color:var(--sh-muted); --text-primary-color:#fff; --disabled-text-color:rgba(159,177,217,.5);
  --divider-color:var(--sh-line); --primary-color:var(--sh-accent); --accent-color:var(--sh-accent);
  --state-icon-color:var(--sh-muted); --paper-item-icon-color:var(--sh-muted); --sidebar-text-color:var(--sh-text);
  --secondary-background-color:rgba(255,255,255,.06); --primary-background-color:var(--sh-bg1);
  --mdc-theme-primary:var(--sh-accent); --mdc-theme-surface:var(--sh-bg2); --mdc-theme-text-primary-on-background:var(--sh-text)}
.cu-embed > *{display:block}
.cu-custom .cu-embed{--ha-card-background:transparent; --ha-card-border-width:0; --ha-card-border-color:transparent; margin:-8px -16px -16px}
.cu-embed-msg{display:flex; align-items:center; gap:10px; padding:16px; border:1px dashed var(--sh-line); border-radius:14px; color:var(--sh-muted); font-size:.85rem; margin:0}
.cu-custom .cu-embed-msg{margin:8px 16px 16px}
.cu-embed-msg .ic{flex:none; width:20px; height:20px}
.cu-embed-msg.err{color:#fca5a5; border-color:rgba(239,41,69,.45)}
`;

// ------------------------------------------------------------------ Editor

/** Gespeicherte Anordnung bereinigen und um fehlende Widgets ergänzen. */
function shNormalizeOrder(saved) {
  saved = saved && typeof saved === "object" ? saved : {};
  const seen = new Set();
  const order = { a: [], b: [], c: [] };
  for (const key of ["a", "b", "c"]) {
    for (const id of Array.isArray(saved[key]) ? saved[key] : []) {
      if (WIDGET_NAMES[id] && !seen.has(id)) {
        order[key].push(id);
        seen.add(id);
      }
    }
  }
  for (const key of ["a", "b", "c"]) for (const id of DEFAULT_ORDER[key]) if (!seen.has(id)) order[key].push(id);
  return order;
}

/** Ist ein Widget mit der aktuellen Konfiguration sichtbar? (für die Anordnung im Editor) */
function shWidgetActive(id, c) {
  const on = (k) => c[k] !== false;
  const has = (k) => Array.isArray(c[k]) && c[k].length > 0;
  return {
    alarm: true,
    people: on("show_people"),
    automation: on("show_automation"),
    panic: on("show_panic"),
    weather: on("show_weather") && !!c.weather_entity,
    climate: on("show_climate") && has("climate_entities"),
    cameras: on("show_cameras") && has("camera_entities"),
    covers: on("show_covers") && has("cover_entities"),
    lights: on("show_lights") && has("light_entities"),
    scenes: on("show_scenes") && has("scene_entities"),
    sensors: on("show_sensors"),
    events: on("show_events"),
    fuel: on("show_fuel") && has("fuel_entities"),
    custom1: shEmbedConfig(c, 1) !== null,
    custom2: shEmbedConfig(c, 2) !== null,
    custom3: shEmbedConfig(c, 3) !== null,
    custom4: shEmbedConfig(c, 4) !== null,
  }[id];
}

/** Kartenkonfiguration eines eigenen Widgets – null, wenn ausgeschaltet oder leer. */
function shEmbedConfig(c, n) {
  if (!c || c[`show_custom_${n}`] !== true) return null;
  const card = c[`custom_${n}_card`];
  return card && typeof card === "object" && !Array.isArray(card) && Object.keys(card).length ? card : null;
}

/** Anzeigename eines Widgets (eigene Widgets mit ihrer Überschrift). */
function shWidgetName(id, c) {
  const m = /^custom(\d)$/.exec(id);
  if (m && c) {
    const t = String(c[`custom_${m[1]}_title`] || "").trim();
    if (t) return `${WIDGET_NAMES[id]} · ${t}`;
  }
  if (id === "fuel" && c && String(c.fuel_title || "").trim()) return String(c.fuel_title).trim();
  return WIDGET_NAMES[id] || id;
}

/** Vergleichsschlüssel einer Kartenkonfiguration (ohne Anordnung, Schlüssel sortiert). */
function shConfigKey(cfg) {
  const norm = (v) => {
    if (Array.isArray(v)) return v.map(norm);
    if (v && typeof v === "object") {
      const o = {};
      for (const k of Object.keys(v).sort()) if (k !== "layout_order" && k !== "widget_sizes") o[k] = norm(v[k]);
      return o;
    }
    return v;
  };
  return JSON.stringify(norm(cfg || {}));
}

/** Nur Felder übernehmen, die sich im Formular tatsächlich geändert haben. */
function shMergeChanged(config, before, after) {
  const cfg = { ...config };
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const k of keys) {
    if (JSON.stringify(before?.[k]) === JSON.stringify(after?.[k])) continue;
    if (after?.[k] === undefined || after[k] === "") delete cfg[k];
    else cfg[k] = after[k];
  }
  return cfg;
}

const EDITOR_LABELS = {
  bg_red: "Rot",
  bg_green: "Grün",
  bg_blue: "Blau",
  entity: "Safe-Home-Alarmanlage",
  layout: "Layout",
  title: "Titel (optional)",
  show_automation: "Automatik anzeigen",
  show_sensors: "Offene Sensoren anzeigen",
  show_events: "Protokoll anzeigen",
  events_count: "Anzahl Protokolleinträge",
  show_panic: "Panik-Taste anzeigen",
  device: "Gerät",
  fullscreen: "Vollbild (für Panel-Ansicht)",
  show_clock: "Uhrzeit & Begrüßung anzeigen",
  accent: "Akzentfarbe",
  show_people: "Personen anzeigen",
  people: "Personen (leer = aus der Alarmanlage)",
  show_weather: "Wetter anzeigen",
  weather_entity: "Wetter-Entität",
  weather_name: "Ortsname (optional)",
  show_forecast: "Vorhersage anzeigen",
  forecast_days: "Anzahl Vorhersage-Einträge",
  show_climate: "Raumklima anzeigen",
  climate_entities: "Thermometer & Luftfeuchte-Sensoren",
  show_covers: "Rollos anzeigen",
  cover_entities: "Rollos / Jalousien",
  covers_group_by_area: "Nach Räumen gruppieren",
  show_cover_all: "Tasten „Alle hoch / runter“",
  show_lights: "Licht anzeigen",
  light_entities: "Lampen & Schalter",
  show_scenes: "Szenen & Skripte anzeigen",
  scene_entities: "Szenen & Skripte",
  show_cameras: "Kameras anzeigen",
  camera_entities: "Kameras",
  camera_refresh: "Kamerabild aktualisieren alle",
  show_fuel: "Kraftstoffpreise anzeigen",
  fuel_title: "Überschrift (optional)",
  fuel_entities: "Tankstellen-Preise (bis zu 4)",
  fuel_sort: "Nach Preis sortieren",
  ...Object.fromEntries(
    SH_EMBED_SLOTS.flatMap((n) => [
      [`show_custom_${n}`, `Eigenes Widget ${n} anzeigen`],
      [`custom_${n}_title`, "Überschrift (optional)"],
      [`custom_${n}_card`, "Karten-Code (YAML)"],
    ])
  ),
};
const EDITOR_HELPERS = {
  device: "Automatisch richtet sich nach der Breite. Smartphone = eine Spalte, Tablet = größere Tasten und bis zu drei Spalten.",
  climate_entities: "Temperatur und Luftfeuchte desselben Geräts werden automatisch zu einer Kachel zusammengefasst, benannt nach dem Raum.",
  cover_entities: "Rollos werden nach dem Bereich (Raum) gruppiert, der in Home Assistant hinterlegt ist.",
  fullscreen: "Füllt den ganzen Bildschirm – ideal in einer Ansicht vom Typ „Panel“.",
  fuel_entities: "Preis-Sensoren deiner Tankstellen, z. B. aus Tankerkönig (Super oder Super E10). Es werden höchstens 4 angezeigt; die günstigste geöffnete Tankstelle wird hervorgehoben.",
  ...Object.fromEntries(
    SH_EMBED_SLOTS.map((n) => [
      `custom_${n}_card`,
      "Beliebige Dashboard-Karte als YAML, z. B. „type: entities“ mit „entities:“ – auch Karten aus HACS (custom:…). Den Code bekommst du im Karteneditor über „Code-Editor anzeigen“.",
    ])
  ),
};

// ------------------------------------------------------------------ Registrierung
/**
 * Alle Karten-Klassen werden erst bei der Registrierung erzeugt und an das *aktuelle*
 * window.HTMLElement gebunden. Hintergrund: Home Assistant bzw. andere Karten laden das Polyfill
 * „scoped-custom-element-registry“, das window.customElements und window.HTMLElement nachträglich
 * austauscht. Eine vorher angemeldete Karte wäre danach für Home Assistant „nicht vorhanden“
 * („Custom element doesn't exist“) bzw. ließe sich nicht mehr erzeugen („Illegal constructor“).
 */
function shCreateClasses(BaseElement) {
  const HTMLElement = BaseElement;

class SafeHomeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._keypad = null; // {action, code}
    this._toast = null;
    this._holding = false;
    this._sig = "";
  }

  static getConfigElement() {
    return document.createElement("safe-home-card-editor");
  }

  static getStubConfig(hass) {
    const ent = Object.keys(hass?.states || {}).find(
      (e) => e.startsWith("alarm_control_panel.") && hass.states[e]?.attributes?.integration === "safe_home"
    );
    return { entity: ent || "alarm_control_panel.safe_home", ...(this.defaultLayout ? { layout: this.defaultLayout } : {}) };
  }

  setConfig(config) {
    if (!config) throw new Error("Ungültige Konfiguration");
    this._rawConfig = config;
    this._config = {
      show_sensors: true,
      show_events: true,
      show_automation: true,
      show_panic: true,
      ...((config.layout || this.constructor.defaultLayout) === "custom" ? CUSTOM_DEFAULTS : {}),
      ...config,
    };
    this._sig = "";
    if (!this._hass) return;
    if (!this.shadowRoot.querySelector("ha-card")) {
      this._render();
      return;
    }
    clearTimeout(this._cfgT);
    this._cfgT = setTimeout(() => this._render(), 120);
  }

  set hass(hass) {
    this._hass = hass;
    // Home Assistant übergibt beim (Neu-)Start manchmal zuerst die Daten und erst danach die
    // Konfiguration – dann noch nichts tun, setConfig zeichnet die Karte anschließend.
    if (!this._config || !hass?.states) return;
    try {
      this._updateFromHass(hass);
    } catch (err) {
      console.warn("Safe Home: Aktualisierung fehlgeschlagen", err);
    }
  }

  _updateFromHass(hass) {
    const ent = this._entityId();
    const st = hass.states[ent];
    const a = st?.attributes || {};
    const related = [a.auto_mode_entity, a.night_auto_entity, ...(a.open_sensors || []), ...(a.bypassed_sensors || []), ...(a.persons || []), ...this._customWatched(a)]
      .filter(Boolean)
      .map((e) => hass.states[e]?.last_updated || "")
      .join("|");
    const sig = `${st?.last_updated}|${st?.state}|${related}`;
    // Eigene Widgets bekommen jede Aktualisierung direkt (unabhängig vom Neuzeichnen)
    if (this._embeds) for (const e of this._embeds.values()) if (e.el) try { e.el.hass = hass; } catch (_) { /* Karte selbst fehlerhaft */ }
    if (this._layout() === "custom") {
      this._ensureForecast();
      if (this._editing === undefined) this._checkEditing();
    }
    if (sig !== this._sig && !this._holding && !this._dragging) {
      this._sig = sig;
      this._render();
    }
  }

  _layout() {
    const l = this._config?.layout || this.constructor.defaultLayout || "standard";
    return ["standard", "compact", "tablet", "custom"].includes(l) ? l : "standard";
  }

  getCardSize() {
    return { compact: 3, tablet: 9, standard: 8, custom: 12 }[this._layout()];
  }

  getGridOptions() {
    const l = this._layout();
    if (l === "compact") return { columns: 6, min_columns: 4, rows: "auto" };
    if (l === "tablet" || l === "custom") return { columns: "full", min_columns: 12, rows: "auto" };
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  connectedCallback() {
    // Wurde das Element angelegt, bevor die Kartendatei geladen war, hängen übergebene Werte
    // als einfache Eigenschaften am Element und würden die Setter verdecken -> nachreichen.
    for (const prop of ["hass", "preview", "editMode"]) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }
    clearInterval(this._timer);
    this._timer = setInterval(() => this._tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._unsubForecast();
  }

  _entityId() {
    if (this._config?.entity) return this._config.entity;
    const ent = Object.keys(this._hass?.states || {}).find(
      (e) => e.startsWith("alarm_control_panel.") && this._hass.states[e]?.attributes?.integration === "safe_home"
    );
    return ent || "alarm_control_panel.safe_home";
  }

  _name(eid) {
    return this._hass?.states?.[eid]?.attributes?.friendly_name || eid;
  }

  _fmtTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const t = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    if (d.toDateString() === now.toDateString()) return t;
    return `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} ${t}`;
  }

  _remaining(a) {
    if (!a.delay_until) return null;
    const ms = new Date(a.delay_until).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 1000));
  }

  _tick() {
    if (this._layout() === "custom") this._customTick();
    const st = this._hass?.states?.[this._entityId()];
    if (!st || !["arming", "pending"].includes(st.state)) return;
    const a = st.attributes;
    const rem = this._remaining(a);
    const total = a.delay_total || 1;
    const el = this.shadowRoot.querySelector(".count");
    const ring = this.shadowRoot.querySelector(".ring-prog");
    if (el && rem !== null) el.textContent = `${rem}s`;
    if (ring && rem !== null) ring.style.strokeDashoffset = String(339.3 * (1 - rem / total));
  }

  // ---------------------------------------------------------------- Aktionen
  _needsCode(action) {
    const a = this._hass.states[this._entityId()]?.attributes || {};
    if (!a.code_format) return false;
    if (action === "disarm") return true;
    if (action === "away" || action === "night") return !!a.code_arm_required;
    return false;
  }

  _request(action) {
    const st = this._hass.states[this._entityId()];
    if (!st) return;
    if (action === "disarm" && st.state === "disarmed") return;
    if (action === "away" && st.state === "armed_away") return;
    if (action === "night" && st.state === "armed_night") return;
    if (this._needsCode(action)) {
      this._keypad = { action, code: "" };
      this._render();
      return;
    }
    this._run(action);
  }

  async _run(action, code) {
    const entity_id = this._entityId();
    const svc = { disarm: "alarm_disarm", away: "alarm_arm_away", night: "alarm_arm_night" }[action];
    const data = { entity_id };
    if (code) data.code = code;
    try {
      if (svc) await this._hass.callService("alarm_control_panel", svc, data);
      else if (action === "silence") await this._hass.callService("safe_home", "silence", { entity_id });
      else if (action === "panic") await this._hass.callService("safe_home", "panic", { entity_id });
      this._keypad = null;
    } catch (err) {
      this._showToast(err?.message || "Aktion fehlgeschlagen");
      if (this._keypad) this._keypad.code = "";
    }
    this._render();
  }

  _toggle(eid) {
    if (!eid) return;
    this._hass.callService("switch", "toggle", { entity_id: eid });
  }

  _showToast(msg, kind = "err") {
    this._toast = msg;
    this._toastKind = kind;
    this._render();
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => {
      this._toast = null;
      this._render();
    }, 3500);
  }

  _startHold(btn) {
    this._holding = true;
    btn.classList.add("holding");
    this._holdT = setTimeout(() => {
      this._holding = false;
      btn.classList.remove("holding");
      if (navigator.vibrate) navigator.vibrate(200);
      this._run("panic");
    }, 2000);
  }

  _endHold(btn) {
    clearTimeout(this._holdT);
    if (this._holding) {
      this._holding = false;
      btn.classList.remove("holding");
    }
  }

  // ----------------------------------------------------------------- Rendern
  /**
   * Fehler beim Zeichnen dürfen nie nach außen dringen – sonst ersetzt Home Assistant die
   * Karte durch „Konfigurationsfehler“. Stattdessen kurzer Hinweis und neuer Versuch.
   */
  _render() {
    if (!this._config || !this._hass?.states) return;
    try {
      this._renderInner();
      this._renderFailures = 0;
    } catch (err) {
      console.warn("Safe Home: Karte konnte nicht gezeichnet werden – neuer Versuch", err);
      this._renderFailures = (this._renderFailures || 0) + 1;
      this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card class="tone-off l-standard" style="padding:16px">
        <div style="display:flex;align-items:center;gap:10px;color:#9fb1d9;font-size:.9rem">${icon("clock")} Safe Home wird geladen …</div></ha-card>`;
      clearTimeout(this._retryT);
      if (this._renderFailures < 6) this._retryT = setTimeout(() => this._render(), 1000 * this._renderFailures);
    }
  }

  _renderInner() {
    const cfg = this._config;
    const st = this._hass.states[this._entityId()];
    const state = st ? st.state : "unavailable";
    const a = st?.attributes || {};
    const info = STATE_INFO[state] || STATE_INFO.unavailable;
    const title = cfg.title || a.friendly_name || "Safe Home";

    let sub = info.sub;
    if (state === "arming") sub = `${MODE_LABEL[a.arming_target] || ""} in`;
    if (state === "pending") sub = a.trigger_cause || info.sub;
    if (state === "triggered") sub = a.trigger_cause || info.sub;
    if (state === "disarmed" && a.auto_arm_pending) sub = "Alle weg – scharf in Kürze";

    const rem = this._remaining(a);
    const total = a.delay_total || 1;
    const showRing = ["arming", "pending"].includes(state) && rem !== null;
    const dash = showRing ? 339.3 * (1 - rem / total) : 0;

    const modeBtn = (key, label, ic, active) => `
      <button class="mode ${active ? "active" : ""} m-${key}" data-action="${key}" ${state === "triggered" && key !== "disarm" ? "disabled" : ""}>
        <span class="mode-ic">${icon(ic)}</span>
        <span class="mode-label">${label}</span>
      </button>`;

    const isAway = state === "armed_away" || (state === "arming" && a.arming_target === "away") || (["pending", "triggered"].includes(state) && a.mode === "away");
    const isNight = state === "armed_night" || (state === "arming" && a.arming_target === "night") || (["pending", "triggered"].includes(state) && a.mode === "night");

    // Sensoren
    let sensorsHtml = "";
    if (cfg.show_sensors && st) {
      const open = a.open_sensors || [];
      const bypassed = new Set(a.bypassed_sensors || []);
      const monitored = new Set([...(a.away_sensors || []), ...(a.night_sensors || [])]);
      const items = [...new Set([...open, ...bypassed])];
      sensorsHtml = `
        <div class="section">
          <div class="sec-head"><span>Sensoren</span><span class="muted">${monitored.size} überwacht</span></div>
          ${
            items.length
              ? `<div class="chips">${items
                  .map((e) => {
                    const isBy = bypassed.has(e);
                    return `<span class="chip ${isBy ? "by" : "open"}">${icon(isBy ? "bypass" : "door")}${esc(this._name(e))}<em>${isBy ? "überbrückt" : "offen"}</em></span>`;
                  })
                  .join("")}</div>`
              : `<div class="allok">${icon("check")} Alles geschlossen &amp; ruhig</div>`
          }
        </div>`;
    }

    // Automatik
    let autoHtml = "";
    if (cfg.show_automation && st) {
      const autoOn = a.auto_mode_entity ? this._hass.states[a.auto_mode_entity]?.state === "on" : !!a.auto_mode;
      const nightOn = a.night_auto_entity ? this._hass.states[a.night_auto_entity]?.state === "on" : !!a.night_auto;
      const persons = a.persons || [];
      const ppl = persons
        .map((p) => {
          const s = this._hass.states[p];
          const home = s?.state === "home";
          const nm = (s?.attributes?.friendly_name || p).split(" ")[0];
          const pic = s?.attributes?.entity_picture;
          return `<span class="pp ${home ? "home" : ""}" title="${esc(nm)}: ${home ? "zuhause" : "unterwegs"}">${
            pic ? `<img src="${esc(pic)}" alt="">` : esc(nm.slice(0, 1).toUpperCase())
          }</span>`;
        })
        .join("");
      autoHtml = `
        <div class="autorow">
          <button class="tog ${autoOn ? "on" : ""}" data-toggle="${esc(a.auto_mode_entity || "")}">
            ${icon("pin")}<span><b>Home-Zone</b><small>${autoOn ? "Automatik an" : "Automatik aus"}</small></span><i class="sw"></i>
          </button>
          <button class="tog ${nightOn ? "on" : ""}" data-toggle="${esc(a.night_auto_entity || "")}">
            ${icon("night")}<span><b>Nachtzeit</b><small>${nightOn ? "Zeitplan an" : "Zeitplan aus"}</small></span><i class="sw"></i>
          </button>
        </div>
        ${persons.length ? `<div class="people">${ppl}<span class="muted">${a.people_home ?? 0} von ${persons.length} zuhause</span></div>` : ""}`;
    }

    // Ereignisse
    let eventsHtml = "";
    if (cfg.show_events && st) {
      const ev = (a.events || []).slice(0, Number(cfg.events_count) || (this._layout() === "tablet" ? 8 : 5));
      eventsHtml = `
        <div class="section">
          <div class="sec-head"><span>Protokoll</span></div>
          ${
            ev.length
              ? `<ul class="events">${ev
                  .map(
                    (e) =>
                      `<li><i class="dot t-${EVENT_TONE[e.type] || "info"}"></i><span class="ev-msg">${esc(e.message)}</span><time>${this._fmtTime(e.time)}</time></li>`
                  )
                  .join("")}</ul>`
              : `<div class="muted small">Noch keine Ereignisse</div>`
          }
        </div>`;
    }

    // Alarm-Aktionen
    const alarmActions =
      state === "triggered"
        ? `<div class="alarm-actions">
            ${a.siren_active ? `<button class="big ghost" data-action="silence">${icon("mute")} Sirene stumm</button>` : ""}
            <button class="big solid" data-action="disarm">${icon("home")} Entschärfen</button>
          </div>`
        : state === "pending"
        ? `<div class="alarm-actions"><button class="big solid" data-action="disarm">${icon("home")} Jetzt entschärfen</button></div>`
        : "";

    // PIN-Feld
    let keypadHtml = "";
    if (this._keypad) {
      const numeric = a.code_format === "number";
      const label = { disarm: "Zuhause – unscharf schalten", away: "Unterwegs aktivieren", night: "Nacht aktivieren" }[this._keypad.action];
      keypadHtml = `
        <div class="overlay">
          <div class="pad">
            <div class="pad-head"><span>${esc(label)}</span><button class="x" data-pad="cancel" aria-label="Abbrechen">${icon("close")}</button></div>
            ${
              numeric
                ? `<div class="dots">${
                    this._keypad.code.length
                      ? Array.from(this._keypad.code).map(() => "<i></i>").join("")
                      : '<span class="muted">PIN eingeben</span>'
                  }</div>
                   <div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9]
                     .map((n) => `<button data-key="${n}">${n}</button>`)
                     .join("")}<button data-pad="back" aria-label="Löschen">${icon("back")}</button><button data-key="0">0</button><button class="ok" data-pad="ok">OK</button></div>`
                : `<input class="codein" type="password" placeholder="Code eingeben" autocomplete="off"><button class="big solid" data-pad="ok">Bestätigen</button>`
            }
          </div>
        </div>`;
    }

    const headerHtml = `
        <header>
          <img class="logo" src="${LOGO_URL}" alt="Safe Home Logo">
          <div class="ttl"><h2>${esc(title)}</h2><span>Alarmanlage</span></div>
          <span class="pill">${esc(info.label)}</span>
        </header>`;
    const heroHtml = `
        <div class="hero">
          <div class="ring">
            <svg viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="54"/>
              ${showRing ? `<circle class="ring-prog" cx="60" cy="60" r="54" style="stroke-dashoffset:${dash}"/>` : `<circle class="ring-full" cx="60" cy="60" r="54"/>`}
            </svg>
            <div class="ring-ic">${icon(info.icon)}</div>
          </div>
          <div class="hero-txt">
            <div class="state">${esc(info.label)}</div>
            <div class="sub">${esc(sub)} ${showRing ? `<span class="count">${rem}s</span>` : ""}</div>
            ${a.changed_by && !["arming", "pending", "triggered"].includes(state) ? `<div class="by">${esc(a.changed_by)}</div>` : ""}
          </div>
        </div>`;
    const modesHtml = `
        <div class="modes">
          ${modeBtn("disarm", "Zuhause", "home", state === "disarmed")}
          ${modeBtn("away", "Unterwegs", "away", isAway)}
          ${modeBtn("night", "Nacht", "night", isNight)}
        </div>`;
    const panicHtml =
      cfg.show_panic && st && state !== "triggered"
        ? `<button class="panic" data-hold="panic">${icon("sos")}<span>Panikalarm – 2 Sekunden halten</span><i class="fill"></i></button>`
        : "";

    const layout = this._layout();
    let body;
    if (layout === "compact") {
      body = `
        <div class="c-head">
          <div class="c-ic">${icon(info.icon)}</div>
          <div class="c-txt">
            <div class="c-title"><img class="c-logo" src="${LOGO_URL}" alt="">${esc(title)}</div>
            <div class="c-state">${esc(info.label)}<span class="c-sub">${esc(sub)}${showRing ? ` <span class="count">${rem}s</span>` : ""}</span></div>
          </div>
          ${state === "triggered" && a.siren_active ? `<button class="c-mute" data-action="silence" aria-label="Sirene stumm">${icon("mute")}</button>` : ""}
        </div>
        ${showRing ? `<div class="c-bar"><i style="width:${(100 * rem) / total}%"></i></div>` : ""}
        ${modesHtml}`;
    } else if (layout === "custom") {
      body = this._renderCustom({ headerHtml, heroHtml, modesHtml, alarmActions, autoHtml, sensorsHtml, eventsHtml, panicHtml, info, title, st, a, state });
    } else if (layout === "tablet") {
      body = `
        ${headerHtml}
        <div class="tb-grid">
          <section class="tb-col tb-main">
            ${heroHtml}
            ${alarmActions}
            ${modesHtml}
            ${panicHtml}
          </section>
          <section class="tb-col tb-info">
            ${autoHtml ? `<div class="tb-box"><div class="sec-head"><span>Automatik</span></div>${autoHtml}</div>` : ""}
            ${sensorsHtml ? `<div class="tb-box">${sensorsHtml}</div>` : ""}
          </section>
          ${eventsHtml ? `<section class="tb-col tb-log"><div class="tb-box">${eventsHtml}</div></section>` : ""}
        </div>`;
    } else {
      body = `
        ${headerHtml}
        ${heroHtml}
        ${alarmActions}
        ${modesHtml}
        ${autoHtml}
        ${sensorsHtml}
        ${eventsHtml}
        ${panicHtml}`;
    }

    // Eigene Hintergrundfarbe (RGB-Regler)
    const bgStyle = esc(shColorCard(cfg));

    this.shadowRoot.innerHTML = `
      <style>${STYLE}${layout === "compact" ? STYLE_COMPACT : ""}${layout === "tablet" ? STYLE_TABLET : ""}${layout === "custom" ? STYLE_TABLET + STYLE_CUSTOM : ""}</style>
      <ha-card class="tone-${info.tone} l-${layout} ${layout === "custom" ? this._customClasses() : ""}" style="${bgStyle}">
        <div class="glow" style="background:radial-gradient(closest-side, ${shRgba(TONE_RGB[info.tone] || TONE_RGB.off, layout === "custom" ? 0.28 : 0.3)}, rgba(0,0,0,0))"></div>
        ${body}
        ${keypadHtml}
        ${this._toast ? `<div class="toast ${this._toastKind === "ok" ? "ok" : ""}">${icon(this._toastKind === "ok" ? "check" : "warn")}${esc(this._toast)}</div>` : ""}
      </ha-card>`;

    this._bind();
    if (layout === "custom") this._mountEmbeds();
  }

  // ================================================================ Custom-Layout
  _customClasses() {
    const c = this._config;
    const dev = ["phone", "tablet"].includes(c.device) ? c.device : "auto";
    return `d-${dev} ${c.fullscreen ? "fs" : ""} acc-${c.accent || "auto"}`;
  }

  _customWatched(a) {
    const c = this._config || {};
    if (this._layout() !== "custom") return [];
    return [
      ...(c.people?.length ? c.people : a.persons || []),
      c.weather_entity,
      ...(c.climate_entities || []),
      ...(c.cover_entities || []),
      ...(c.light_entities || []),
      ...(c.scene_entities || []),
      ...(c.camera_entities || []),
      ...this._fuelWatched(),
    ].filter(Boolean);
  }

  _ensureForecast() {
    const c = this._config || {};
    const eid = c.show_weather && c.show_forecast !== false ? c.weather_entity : null;
    const conn = this._hass?.connection;
    if (!eid || !conn || typeof conn.subscribeMessage !== "function") {
      if (this._fcEntity) this._unsubForecast();
      return;
    }
    // Nach einem Neustart der App baut Home Assistant eine neue Verbindung auf -> neu abonnieren
    if (this._fcEntity === eid && this._fcConn === conn) return;
    this._unsubForecast();
    this._fcEntity = eid;
    this._fcConn = conn;
    const feat = this._hass.states?.[eid]?.attributes?.supported_features || 0;
    const type = feat & 1 ? "daily" : feat & 4 ? "twice_daily" : "hourly";
    this._fcType = type;
    try {
      Promise.resolve(
        conn.subscribeMessage(
          (msg) => {
            this._forecast = Array.isArray(msg?.forecast) ? msg.forecast : [];
            this._sig = "";
            this._render();
          },
          { type: "weather/subscribe_forecast", forecast_type: type, entity_id: eid }
        )
      )
        .then((unsub) => {
          if (this._fcEntity === eid && this._fcConn === conn) this._fcUnsub = unsub;
          else if (typeof unsub === "function") unsub();
        })
        .catch(() => {
          this._forecast = [];
        });
    } catch (e) {
      this._forecast = [];
    }
  }

  _unsubForecast() {
    if (this._fcUnsub) {
      try {
        this._fcUnsub();
      } catch (e) {
        /* ignore */
      }
    }
    this._fcUnsub = null;
    this._fcEntity = null;
    this._fcConn = null;
    this._forecast = null;
  }

  _customTick() {
    this._checkEditing();
    const root = this.shadowRoot;
    const now = new Date();
    const clk = root.querySelector(".cu-time");
    if (clk) clk.textContent = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    this._camTick = (this._camTick || 0) + 1;
    const every = Number(this._config.camera_refresh) || 10;
    if (this._camTick % every === 0) {
      root.querySelectorAll("img.cam[data-src]").forEach((img) => {
        const base = img.dataset.src;
        img.src = `${base}${base.includes("?") ? "&" : "?"}t=${Date.now()}`;
      });
    }
  }

  _areaName(eid) {
    const h = this._hass;
    const ent = h.entities?.[eid];
    const areaId = ent?.area_id || (ent?.device_id ? h.devices?.[ent.device_id]?.area_id : null);
    return areaId ? h.areas?.[areaId]?.name || null : null;
  }

  _greeting(d) {
    const h = d.getHours();
    if (h < 5) return "Gute Nacht";
    if (h < 11) return "Guten Morgen";
    if (h < 17) return "Guten Tag";
    if (h < 22) return "Guten Abend";
    return "Gute Nacht";
  }

  _box(title, inner, extra = "", cls = "") {
    return `<div class="tb-box cu-box ${cls}"><div class="sec-head"><span>${title}</span>${extra}</div>${inner}</div>`;
  }

  _cuPeople(a) {
    const c = this._config;
    const persons = c.people?.length ? c.people : a.persons || [];
    if (!c.show_people || !persons.length) return "";
    const home = persons.filter((p) => this._hass.states[p]?.state === "home").length;
    const items = persons
      .map((p) => {
        const s = this._hass.states[p];
        const st = s?.state || "unknown";
        const isHome = st === "home";
        const name = s?.attributes?.friendly_name || p;
        const first = name.split(" ")[0];
        const pic = s?.attributes?.entity_picture;
        let where = isHome ? "Zuhause" : st === "not_home" ? "Unterwegs" : ["unknown", "unavailable"].includes(st) ? "Unbekannt" : st;
        const zone = this._hass.states[`zone.${st}`];
        if (zone && !isHome) where = zone.attributes.friendly_name || where;
        const since = s?.last_changed ? this._fmtTime(s.last_changed) : "";
        return `<button class="person ${isHome ? "home" : ""}" data-more="${esc(p)}">
          <span class="av">${pic ? `<img src="${esc(pic)}" alt="">` : esc(first.slice(0, 1).toUpperCase())}<i class="badge">${icon(isHome ? "home" : "pin")}</i></span>
          <b>${esc(first)}</b><small>${esc(where)}</small>${since ? `<em>seit ${since}</em>` : ""}
        </button>`;
      })
      .join("");
    return this._box("Personen", `<div class="people-grid">${items}</div>`, `<span class="muted">${home} von ${persons.length} zuhause</span>`, "cu-people");
  }

  _cuWeather() {
    const c = this._config;
    if (!c.show_weather || !c.weather_entity) return "";
    const s = this._hass.states[c.weather_entity];
    if (!s) return this._box("Wetter", `<div class="muted small">${esc(c.weather_entity)} nicht gefunden</div>`);
    const at = s.attributes;
    const unit = at.temperature_unit || "°C";
    const cond = s.state;
    const details = [
      at.humidity != null ? `<span>${icon("drop")}${Math.round(at.humidity)} %</span>` : "",
      at.wind_speed != null ? `<span>${icon("wind")}${Math.round(at.wind_speed)} ${esc(at.wind_speed_unit || "km/h")}</span>` : "",
      at.pressure != null ? `<span>${icon("gauge")}${Math.round(at.pressure)} ${esc(at.pressure_unit || "hPa")}</span>` : "",
    ].join("");
    let fc = "";
    const days = Number(c.forecast_days) || 5;
    if (c.show_forecast !== false && this._forecast?.length) {
      fc = `<div class="fc">${this._forecast
        .slice(0, days)
        .map((f) => {
          const d = new Date(f.datetime);
          const label =
            this._fcType === "hourly"
              ? d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
              : d.toLocaleDateString("de-DE", { weekday: "short" }) + (this._fcType === "twice_daily" ? (f.is_daytime === false ? " ☾" : "") : "");
          return `<div class="fc-d"><small>${esc(label)}</small>${weatherIcon(f.condition)}<b>${Math.round(f.temperature)}°</b>${
            f.templow != null ? `<em>${Math.round(f.templow)}°</em>` : ""
          }${f.precipitation_probability != null ? `<i>${Math.round(f.precipitation_probability)} %</i>` : ""}</div>`;
        })
        .join("")}</div>`;
    }
    const place = c.weather_name || at.friendly_name || "";
    return this._box(
      "Wetter",
      `<button class="wx" data-more="${esc(c.weather_entity)}">
        <span class="wx-ic">${weatherIcon(cond, true)}</span>
        <span class="wx-main"><b>${at.temperature != null ? Math.round(at.temperature * 10) / 10 : "–"}<sup>${esc(unit)}</sup></b><small>${esc(WEATHER_DE[cond] || cond)}</small></span>
        <span class="wx-det">${details}</span>
      </button>${fc}`,
      `<span class="muted">${esc(place)}</span>`,
      "cu-weather"
    );
  }

  _cuClimate() {
    const c = this._config;
    const list = c.climate_entities || [];
    if (!c.show_climate || !list.length) return "";
    const groups = new Map();
    for (const eid of list) {
      const s = this._hass.states[eid];
      const ent = this._hass.entities?.[eid];
      const key = ent?.device_id || eid;
      if (!groups.has(key)) groups.set(key, { name: null, temp: null, hum: null, tUnit: "°C", ids: [] });
      const g = groups.get(key);
      g.ids.push(eid);
      const dc = s?.attributes?.device_class;
      const unit = s?.attributes?.unit_of_measurement || "";
      const isHum = dc === "humidity" || unit === "%";
      if (isHum) g.hum = s?.state;
      else {
        g.temp = s?.state;
        g.tUnit = unit || "°C";
      }
      if (!g.name) {
        const dev = ent?.device_id ? this._hass.devices?.[ent.device_id] : null;
        g.name = this._areaName(eid) || dev?.name_by_user || dev?.name || s?.attributes?.friendly_name || eid;
      }
    }
    const num = (v) => (v == null || isNaN(parseFloat(v)) ? null : parseFloat(v));
    const tiles = [...groups.values()]
      .map((g) => {
        const t = num(g.temp);
        const h = num(g.hum);
        const tone = t == null ? "" : t < 18 ? "cold" : t > 24 ? "warm" : "ok";
        const htone = h == null ? "" : h < 35 || h > 65 ? "warn" : "";
        return `<button class="clim ${tone}" data-more="${esc(g.ids[0])}">
          <small>${esc(g.name)}</small>
          <span class="clim-v">${t != null ? `${icon("thermo")}<b>${t.toFixed(1)}</b><sup>${esc(g.tUnit)}</sup>` : ""}</span>
          ${h != null ? `<span class="clim-h ${htone}">${icon("drop")}${Math.round(h)} %</span>` : ""}
        </button>`;
      })
      .join("");
    return this._box("Raumklima", `<div class="clim-grid">${tiles}</div>`, "", "cu-climate");
  }

  _cuCovers() {
    const c = this._config;
    const list = c.cover_entities || [];
    if (!c.show_covers || !list.length) return "";
    const row = (eid) => {
      const s = this._hass.states[eid];
      const pos = s?.attributes?.current_position;
      const name = s?.attributes?.friendly_name || eid;
      const st = s?.state;
      const label = pos != null ? `${pos} % offen` : { open: "Offen", closed: "Geschlossen", opening: "Öffnet …", closing: "Schließt …" }[st] || st || "–";
      const moving = st === "opening" || st === "closing";
      return `<div class="cov">
        <button class="cov-name" data-more="${esc(eid)}"><b>${esc(name)}</b><small>${esc(label)}</small>
          <i class="cov-bar"><i style="width:${pos != null ? pos : st === "open" ? 100 : 0}%"></i></i></button>
        <div class="cov-btns">
          <button data-svc="cover.open_cover" data-eid="${esc(eid)}" aria-label="Hoch">${icon("up")}</button>
          <button class="${moving ? "act" : ""}" data-svc="cover.stop_cover" data-eid="${esc(eid)}" aria-label="Stopp">${icon("stop")}</button>
          <button data-svc="cover.close_cover" data-eid="${esc(eid)}" aria-label="Runter">${icon("down")}</button>
        </div>
      </div>`;
    };
    let inner = "";
    if (c.covers_group_by_area !== false) {
      const groups = new Map();
      for (const eid of list) {
        const area = this._areaName(eid) || "Weitere";
        if (!groups.has(area)) groups.set(area, []);
        groups.get(area).push(eid);
      }
      inner = [...groups.entries()]
        .map(
          ([area, ids]) => `<div class="cov-room"><div class="cov-room-h"><span>${esc(area)}</span>${
            ids.length > 1
              ? `<span class="mini"><button data-svc="cover.open_cover" data-eid="${esc(ids.join(","))}" aria-label="Raum hoch">${icon("up")}</button><button data-svc="cover.close_cover" data-eid="${esc(ids.join(","))}" aria-label="Raum runter">${icon("down")}</button></span>`
              : ""
          }</div>${ids.map(row).join("")}</div>`
        )
        .join("");
    } else inner = list.map(row).join("");
    const all =
      c.show_cover_all !== false && list.length > 1
        ? `<span class="cov-all"><button data-svc="cover.open_cover" data-eid="${esc(list.join(","))}">${icon("up")}Alle</button><button data-svc="cover.close_cover" data-eid="${esc(list.join(","))}">${icon("down")}Alle</button></span>`
        : "";
    return this._box("Rollos", inner, all, "cu-covers");
  }

  _cuLights() {
    const c = this._config;
    const list = c.light_entities || [];
    if (!c.show_lights || !list.length) return "";
    const tiles = list
      .map((eid) => {
        const s = this._hass.states[eid];
        const on = s?.state === "on";
        const br = s?.attributes?.brightness;
        const name = s?.attributes?.friendly_name || eid;
        return `<button class="lt ${on ? "on" : ""}" data-svc="homeassistant.toggle" data-eid="${esc(eid)}">
          ${icon("bulb")}<span><b>${esc(name)}</b><small>${on ? (br != null ? `${Math.round((br / 255) * 100)} %` : "An") : "Aus"}</small></span></button>`;
      })
      .join("");
    const anyOn = list.filter((e) => this._hass.states[e]?.state === "on");
    const extra = anyOn.length
      ? `<button class="link" data-svc="homeassistant.turn_off" data-eid="${esc(anyOn.join(","))}">Alle aus</button>`
      : "";
    return this._box("Licht", `<div class="lt-grid">${tiles}</div>`, extra, "cu-lights");
  }

  _cuScenes() {
    const c = this._config;
    const list = c.scene_entities || [];
    if (!c.show_scenes || !list.length) return "";
    const btns = list
      .map((eid) => {
        const s = this._hass.states[eid];
        const name = s?.attributes?.friendly_name || eid;
        return `<button class="scn" data-svc="homeassistant.turn_on" data-eid="${esc(eid)}">${icon(eid.startsWith("script.") ? "play" : "spark")}${esc(name)}</button>`;
      })
      .join("");
    return this._box("Szenen & Skripte", `<div class="scn-wrap">${btns}</div>`, "", "cu-scenes");
  }

  _cuCameras() {
    const c = this._config;
    const list = c.camera_entities || [];
    if (!c.show_cameras || !list.length) return "";
    const tiles = list
      .map((eid) => {
        const s = this._hass.states[eid];
        const pic = s?.attributes?.entity_picture;
        const name = s?.attributes?.friendly_name || eid;
        return `<button class="camt" data-more="${esc(eid)}">${
          pic ? `<img class="cam" data-src="${esc(pic)}" src="${esc(pic)}" alt="${esc(name)}">` : `<span class="cam-off">${icon("camera")}</span>`
        }<span class="cam-l">${esc(name)}</span></button>`;
      })
      .join("");
    return this._box("Kameras", `<div class="cam-grid">${tiles}</div>`, "", "cu-cams");
  }

  // ------------------------------------------------------------ Kraftstoffpreise
  _fuelList() {
    return (Array.isArray(this._config?.fuel_entities) ? this._config.fuel_entities : []).filter(Boolean).slice(0, SH_FUEL_MAX);
  }

  _fuelWatched() {
    const c = this._config || {};
    if (!c.show_fuel) return [];
    const list = this._fuelList();
    return [...list, ...list.map((eid) => this._fuelStatusEntity(eid))];
  }

  /** Geöffnet-Sensor (binary_sensor) desselben Geräts, z. B. von Tankerkönig. */
  _fuelStatusEntity(eid) {
    const ents = this._hass?.entities;
    const dev = ents?.[eid]?.device_id;
    if (!dev) return null;
    if (this._fuelDevCacheSrc !== ents) {
      this._fuelDevCacheSrc = ents;
      this._fuelDevCache = new Map();
    }
    if (!this._fuelDevCache.has(dev)) {
      let found = null;
      for (const [id, e] of Object.entries(ents)) {
        if (e?.device_id === dev && id.startsWith("binary_sensor.")) {
          found = id;
          if (/status|open|geoeffnet|geöffnet/i.test(id)) break;
        }
      }
      this._fuelDevCache.set(dev, found);
    }
    return this._fuelDevCache.get(dev);
  }

  _fuelKind(eid, a) {
    const ft = String(a.fuel_type || a.fuel || "").toLowerCase().replace(/[\s_-]/g, "");
    const map = { e5: "Super", super: "Super", supere5: "Super", e10: "Super E10", supere10: "Super E10", diesel: "Diesel" };
    if (map[ft]) return map[ft];
    const t = `${eid} ${a.friendly_name || ""}`.toLowerCase();
    if (/e10/.test(t)) return "Super E10";
    if (/diesel/.test(t)) return "Diesel";
    if (/super|e5|benzin/.test(t)) return "Super";
    return "";
  }

  _fuelOpen(eid, a) {
    for (const k of ["is_open", "open", "isOpen"]) if (typeof a[k] === "boolean") return a[k];
    const bs = this._fuelStatusEntity(eid);
    const st = bs ? this._hass.states[bs]?.state : null;
    return st === "on" ? true : st === "off" ? false : null;
  }

  _fuelRow(eid) {
    const s = this._hass.states[eid];
    const a = s?.attributes || {};
    const ent = this._hass.entities?.[eid];
    const dev = ent?.device_id ? this._hass.devices?.[ent.device_id] : null;
    const kind = this._fuelKind(eid, a);
    const strip = (n) => String(n || "").replace(/\s*(super\s*e10|super\s*e5|super|e10|e5|diesel)\s*$/i, "").trim();
    const name = a.station_name || a.name || dev?.name_by_user || dev?.name || strip(a.friendly_name) || a.friendly_name || eid;
    const street = [a.street, a.house_number].filter((v) => v != null && v !== "").join(" ");
    const place = [a.postcode ?? a.post_code ?? a.zip, a.city ?? a.place].filter((v) => v != null && v !== "").join(" ");
    let addr = [street, place].filter(Boolean).join(", ") || a.address || "";
    if (a.brand && !String(name).toLowerCase().includes(String(a.brand).toLowerCase())) addr = addr ? `${a.brand} · ${addr}` : a.brand;
    const raw = parseFloat(s?.state);
    const price = s && isFinite(raw) && raw > 0 ? raw : null;
    return {
      eid,
      name,
      addr,
      kind,
      price,
      unit: a.unit_of_measurement,
      missing: !s,
      unavailable: !s || ["unavailable", "unknown"].includes(s.state),
      open: s ? this._fuelOpen(eid, a) : null,
      updated: s?.last_updated ? new Date(s.last_updated).getTime() : 0,
    };
  }

  _fuelPrice(r) {
    if (r.price == null) return `<b class="na">–</b>`;
    const cur = !r.unit || /eur|€/i.test(r.unit) ? "€" : esc(r.unit);
    const txt = r.price.toFixed(3);
    const thousandths = Math.round(r.price * 1000) % 10;
    // Klassische Tankstellen-Anzeige: letzte Ziffer hochgestellt
    if (Math.abs(r.price * 100 - Math.round(r.price * 100)) > 1e-6 || thousandths) {
      return `<b>${txt.slice(0, -1).replace(".", ",")}</b><sup>${txt.slice(-1)}</sup><small>${cur}</small>`;
    }
    return `<b>${r.price.toFixed(2).replace(".", ",")}</b><small>${cur}</small>`;
  }

  _cuFuel() {
    const c = this._config;
    const list = this._fuelList();
    if (!c.show_fuel || !list.length) return "";
    const rows = list.map((eid) => this._fuelRow(eid));
    // Günstigste geöffnete Tankstelle je Sorte (nur wenn es etwas zu vergleichen gibt)
    const byKind = {};
    for (const r of rows) {
      if (r.price == null || r.open === false) continue;
      (byKind[r.kind] = byKind[r.kind] || []).push(r.price);
    }
    const best = {};
    for (const [k, prices] of Object.entries(byKind)) if (prices.length > 1) best[k] = Math.min(...prices);
    if (c.fuel_sort) rows.sort((x, y) => (x.price ?? Infinity) - (y.price ?? Infinity));
    const latest = Math.max(0, ...rows.map((r) => r.updated));
    const html = rows
      .map((r) => {
        const cheap = r.price != null && r.open !== false && best[r.kind] != null && r.price === best[r.kind];
        const closed = r.open === false;
        const tags = [
          r.kind ? `<i class="fuel-kind">${esc(r.kind)}</i>` : "",
          cheap ? `<i class="fuel-best">Günstigste</i>` : "",
          closed ? `<i class="fuel-closed">Geschlossen</i>` : "",
          r.missing ? `<i class="fuel-closed">Entität nicht gefunden</i>` : r.unavailable ? `<i class="fuel-closed">Nicht verfügbar</i>` : "",
        ].join("");
        return `<button class="fuel ${cheap ? "best" : ""} ${closed || r.unavailable ? "closed" : ""}" data-more="${esc(r.eid)}">
          <span class="fuel-logo">${icon("fuel")}</span>
          <span class="fuel-info"><b>${esc(r.name)}</b>${r.addr ? `<small>${esc(r.addr)}</small>` : ""}<span class="fuel-tags">${tags}</span></span>
          <span class="fuel-price">${this._fuelPrice(r)}</span>
        </button>`;
      })
      .join("");
    const stand = latest ? `<span class="fuel-upd">Stand ${new Date(latest).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>` : "";
    const title = String(c.fuel_title || "").trim() || "Kraftstoffpreise";
    return this._box(esc(title), `<div class="fuel-list">${html}</div>`, stand, "cu-fuel");
  }

  // ------------------------------------------------------------ Eigene Widgets (YAML)
  _cuEmbed(n) {
    const c = this._config;
    if (!shEmbedConfig(c, n)) return "";
    const title = String(c[`custom_${n}_title`] || "").trim();
    const inner = `<div class="cu-embed" data-embed="${n}"></div>`;
    return title ? this._box(esc(title), inner, "", "cu-custom") : `<div class="cu-embed-wrap">${inner}</div>`;
  }

  _embedMsg(e) {
    return e.error
      ? `<div class="cu-embed-msg err">${icon("warn")}<span>${esc(e.error)}</span></div>`
      : `<div class="cu-embed-msg">${icon("code")}<span>Widget wird geladen …</span></div>`;
  }

  /** Nach jedem Neuzeichnen: zwischengespeicherte Karten in ihre Plätze einhängen. */
  _mountEmbeds() {
    const c = this._config;
    if (!this._embeds) this._embeds = new Map();
    for (const n of SH_EMBED_SLOTS) {
      const cfg = shEmbedConfig(c, n);
      if (!cfg) {
        this._embeds.delete(n);
        continue;
      }
      const key = JSON.stringify(cfg);
      let e = this._embeds.get(n);
      if (!e || e.key !== key) {
        e = { key, el: null, error: null };
        this._embeds.set(n, e);
        this._createEmbed(n, e, cfg);
      }
      const host = this.shadowRoot.querySelector(`.cu-embed[data-embed="${n}"]`);
      if (!host) continue;
      if (e.el) host.appendChild(e.el);
      else host.innerHTML = this._embedMsg(e);
    }
  }

  async _createEmbed(n, e, cfg) {
    try {
      if (!cfg.type || typeof cfg.type !== "string") throw new Error("Im Code fehlt die Zeile „type:“ (z. B. type: entities).");
      if (/^custom:safe-home/.test(cfg.type)) throw new Error("Eine Safe-Home-Karte kann nicht in sich selbst eingebettet werden.");
      const helpers = typeof window.loadCardHelpers === "function" ? await window.loadCardHelpers() : null;
      if (this._embeds?.get(n) !== e) return;
      if (!helpers?.createCardElement) throw new Error("Die Karten-Hilfen von Home Assistant sind nicht verfügbar.");
      const el = helpers.createCardElement(cfg);
      el.classList.add("cu-embed-card");
      // Karte aus HACS erst nachgeladen -> Home Assistant meldet „ll-rebuild“: nur dieses Widget neu erzeugen
      el.addEventListener("ll-rebuild", (ev) => {
        ev.stopPropagation();
        if (this._embeds?.get(n) !== e) return;
        const next = { key: e.key, el: null, error: null };
        this._embeds.set(n, next);
        el.remove();
        this._createEmbed(n, next, cfg);
      });
      if (this._hass) el.hass = this._hass;
      e.el = el;
    } catch (err) {
      if (this._embeds?.get(n) !== e) return;
      e.error = err?.message || String(err);
    }
    const host = this.shadowRoot.querySelector(`.cu-embed[data-embed="${n}"]`);
    if (!host) return;
    host.replaceChildren();
    if (e.el) host.appendChild(e.el);
    else host.innerHTML = this._embedMsg(e);
  }

  _renderCustom(p) {
    const c = this._config;
    const now = new Date();
    const editing = this._editing;
    const head = `
      <header class="cu-head">
        <img class="logo" src="${LOGO_URL}" alt="Safe Home Logo">
        <div class="ttl"><h2>${esc(p.title)}</h2><span>${c.show_clock !== false ? `${this._greeting(now)} · ${now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}` : "Alarmanlage"}</span></div>
        ${c.show_clock !== false ? `<div class="cu-time">${now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</div>` : ""}
        <span class="pill">${esc(p.info.label)}</span>
      </header>`;
    const people = this._cuPeople(p.a);
    const widgets = {
      alarm: `<div class="cu-alarm">${p.heroHtml}${p.alarmActions}${p.modesHtml}</div>`,
      people,
      automation: p.autoHtml ? this._box("Automatik", p.autoHtml) : "",
      panic: p.panicHtml,
      weather: this._cuWeather(),
      climate: this._cuClimate(),
      cameras: this._cuCameras(),
      covers: this._cuCovers(),
      lights: this._cuLights(),
      scenes: this._cuScenes(),
      sensors: p.sensorsHtml ? `<div class="tb-box cu-box">${p.sensorsHtml}</div>` : "",
      events: p.eventsHtml ? `<div class="tb-box cu-box">${p.eventsHtml}</div>` : "",
      fuel: this._cuFuel(),
      custom1: this._cuEmbed(1),
      custom2: this._cuEmbed(2),
      custom3: this._cuEmbed(3),
      custom4: this._cuEmbed(4),
    };
    const order = this._widgetOrder();
    const col = (key) =>
      order[key]
        .filter((id) => widgets[id])
        .map(
          (id) =>
            `<div class="cu-w" data-w="${id}" data-size="${shSizeOf(c, id)}">${editing ? this._widgetTools(id) : ""}<div class="cu-body">${widgets[id]}</div></div>`
        )
        .join("");
    return `
      ${head}
      ${editing ? `<div class="cu-edit-hint">${icon("grip")} Widgets am Griff greifen und per Drag &amp; Drop verschieben – auch zwischen den Spalten.</div>` : ""}
      <div class="cu-grid ${people ? "hp" : ""} ${editing ? "editing" : ""}">
        <section class="cu-col cu-a" data-col="a">${col("a")}</section>
        <section class="cu-col cu-b" data-col="b">${col("b")}</section>
        <section class="cu-col cu-c" data-col="c">${col("c")}</section>
      </div>`;
  }

  _widgetTools(id) {
    const c = this._config;
    const name = esc(shWidgetName(id, c));
    const sz = shSizeOf(c, id);
    const i = SH_SIZES.findIndex((x) => x.id === sz);
    const cur = SH_SIZES[i];
    return `<div class="cu-tools">
      <button class="cu-handle" aria-label="${name} verschieben">${icon("grip")}<span>${name}</span></button>
      <div class="cu-size" title="Größe: ${esc(cur.label)}">
        <button data-wsize="-1" data-wid="${id}" ${i === 0 ? "disabled" : ""} aria-label="${name} kleiner">−</button>
        <span>${cur.short}</span>
        <button data-wsize="1" data-wid="${id}" ${i === SH_SIZES.length - 1 ? "disabled" : ""} aria-label="${name} größer">+</button>
      </div>
    </div>`;
  }

  _changeSize(id, dir) {
    const sizes = shStepSize(this._config, id, dir);
    clearTimeout(this._sizeT);
    // mehrere schnelle Klicks zusammenfassen und dann einmal speichern
    this._config = { ...this._config, widget_sizes: sizes };
    this._sig = "";
    this._render();
    this._sizeT = setTimeout(() => this._saveLayout({ widget_sizes: this._config.widget_sizes }), 700);
  }

  // ------------------------------------------------------------ Drag & Drop
  _widgetOrder() {
    return shNormalizeOrder(this._config.layout_order);
  }

  /** Bearbeitungsmodus: Kartendialog-Vorschau oder Dashboard im Bearbeitungsmodus. */
  _detectEditing() {
    if (this.preview || this.editMode) return { editing: true, lovelace: null };
    let el = this;
    for (let i = 0; i < 40 && el; i++) {
      const tag = el.localName || "";
      if (tag === "hui-dialog-edit-card" || tag === "hui-card-preview") return { editing: true, lovelace: null };
      if (el.lovelace && typeof el.lovelace === "object") return { editing: !!el.lovelace.editMode, lovelace: el.lovelace };
      el = el.parentNode || (el.getRootNode && el.getRootNode().host) || null;
    }
    return { editing: false, lovelace: null };
  }

  _checkEditing() {
    if (this._layout() !== "custom" || this._dragging) return;
    const { editing, lovelace } = this._detectEditing();
    this._lovelace = lovelace;
    if (editing !== !!this._editing) {
      this._editing = editing;
      this._sig = "";
      this._render();
    }
  }

  _bindDrag() {
    if (!this._editing) return;
    this.shadowRoot.querySelectorAll(".cu-handle").forEach((h) =>
      h.addEventListener("pointerdown", (e) => this._dragStart(e, h.closest(".cu-w")))
    );
    this.shadowRoot.querySelectorAll("[data-wsize]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this._changeSize(b.dataset.wid, Number(b.dataset.wsize));
      })
    );
  }

  _dragStart(e, w) {
    if (!w || (e.button !== undefined && e.button !== 0)) return;
    e.preventDefault();
    const card = this.shadowRoot.querySelector("ha-card");
    const cardRect = card.getBoundingClientRect();
    const r = w.getBoundingClientRect();
    // Eingebettete Karten nicht mitkopieren (würde neue Karten-Instanzen erzeugen)
    const embeds = [...w.querySelectorAll(".cu-embed")].map((e) => {
      const kids = [...e.childNodes];
      const h = e.offsetHeight;
      kids.forEach((k) => k.remove());
      return { e, kids, h };
    });
    const ghost = w.cloneNode(true);
    embeds.forEach(({ e, kids, h }) => {
      const g = ghost.querySelector(`.cu-embed[data-embed="${e.dataset.embed}"]`);
      if (g) g.style.minHeight = `${h || 80}px`;
      kids.forEach((k) => e.appendChild(k));
    });
    ghost.classList.add("cu-ghost");
    Object.assign(ghost.style, { width: `${r.width}px`, left: `${r.left - cardRect.left}px`, top: `${r.top - cardRect.top}px` });
    const ph = document.createElement("div");
    ph.className = "cu-ph";
    ph.style.height = `${r.height}px`;
    w.parentNode.insertBefore(ph, w);
    w.style.display = "none";
    card.appendChild(ghost);
    this._dragging = true;
    const offX = e.clientX - r.left;
    const offY = e.clientY - r.top;

    const move = (ev) => {
      const cr = card.getBoundingClientRect();
      ghost.style.left = `${ev.clientX - offX - cr.left}px`;
      ghost.style.top = `${ev.clientY - offY - cr.top}px`;
      const cols = [...this.shadowRoot.querySelectorAll(".cu-col")];
      let target = null;
      let best = Infinity;
      for (const c of cols) {
        const cr2 = c.getBoundingClientRect();
        const dx = ev.clientX < cr2.left ? cr2.left - ev.clientX : ev.clientX > cr2.right ? ev.clientX - cr2.right : 0;
        const dy = ev.clientY < cr2.top ? cr2.top - ev.clientY : ev.clientY > cr2.bottom ? ev.clientY - cr2.bottom : 0;
        const d = dx * 4 + dy;
        if (d < best) {
          best = d;
          target = c;
        }
      }
      if (!target) return;
      const items = [...target.querySelectorAll(":scope > .cu-w")].filter((x) => x !== w);
      // Positionen ohne den Platzhalter berechnen, sonst springt das Ziel beim Ziehen
      const phShift = ph.parentNode === target ? ph.getBoundingClientRect().height + 16 : 0;
      const before = items.find((x) => {
        const b = x.getBoundingClientRect();
        const after = phShift && ph.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING;
        const top = after ? b.top - phShift : b.top;
        return ev.clientY < top + b.height / 2;
      });
      if (before) {
        if (ph.nextSibling !== before) target.insertBefore(ph, before);
      } else if (target.lastElementChild !== ph) target.appendChild(ph);
      if (ev.clientY < 60) window.scrollBy(0, -12);
      else if (ev.clientY > window.innerHeight - 60) window.scrollBy(0, 12);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      ph.parentNode.insertBefore(w, ph);
      ph.remove();
      ghost.remove();
      w.style.display = "";
      this._dragging = false;
      const order = {};
      this.shadowRoot.querySelectorAll(".cu-col").forEach((c) => {
        order[c.dataset.col] = [...c.querySelectorAll(":scope > .cu-w")].map((x) => x.dataset.w);
      });
      // ausgeblendete Widgets an ihrer bisherigen Spalte behalten
      const prev = this._widgetOrder();
      for (const key of ["a", "b", "c"]) for (const id of prev[key]) if (!Object.values(order).some((l) => l.includes(id))) order[key].push(id);
      this._saveLayout({ layout_order: order });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  /** Anordnung bzw. Größen speichern. patch = { layout_order } oder { widget_sizes } */
  async _saveLayout(patch) {
    const old = this._rawConfig || this._config;
    const what = "layout_order" in patch ? "Anordnung" : "Größe";
    const apply = (cfg) => {
      const n = { ...cfg, ...patch };
      if (n.widget_sizes && !Object.keys(n.widget_sizes).length) delete n.widget_sizes;
      return n;
    };
    this._config = apply(this._config);
    this._sig = "";
    this._render();
    // 1) Karten-Editor geöffnet: Editor übernimmt die Änderung in die Konfiguration
    window.dispatchEvent(new CustomEvent("safe-home-layout-order", { detail: { order: patch.layout_order, patch } }));
    if (this.preview) return;
    // 2) Dashboard im Bearbeitungsmodus: Dashboard-Konfiguration direkt speichern
    const ll = this._lovelace;
    if (!ll || !ll.config || typeof ll.saveConfig !== "function") {
      this._showToast(`${what} bitte im Karten-Editor speichern (Stift-Symbol der Karte)`);
      return;
    }
    if (ll.mode === "yaml" || ll.config.strategy) {
      this._showToast(`Dieses Dashboard wird per YAML bzw. automatisch erzeugt – ${what} bitte im Karten-Editor übernehmen`);
      return;
    }
    // Home Assistant übergibt der Karte eine Kopie ihrer Konfiguration -> Karte über den Inhalt finden
    const key = shConfigKey(old);
    let found = 0;
    const fix = (card) => {
      if (!card || typeof card !== "object") return card;
      if (shConfigKey(card) === key) {
        found++;
        return apply(card);
      }
      let changed = false;
      const next = { ...card };
      if (Array.isArray(card.cards)) {
        next.cards = card.cards.map((c) => {
          const n = fix(c);
          if (n !== c) changed = true;
          return n;
        });
      }
      if (card.card && typeof card.card === "object") {
        const n = fix(card.card);
        if (n !== card.card) {
          next.card = n;
          changed = true;
        }
      }
      return changed ? next : card;
    };
    const views = (ll.config.views || []).map((v) => {
      const nv = { ...v };
      let changed = false;
      if (Array.isArray(v.cards)) {
        nv.cards = v.cards.map((c) => {
          const n = fix(c);
          if (n !== c) changed = true;
          return n;
        });
      }
      if (Array.isArray(v.sections)) {
        nv.sections = v.sections.map((sec) => {
          const ns = fix(sec);
          if (ns !== sec) changed = true;
          return ns;
        });
      }
      return changed ? nv : v;
    });
    if (!found) {
      this._showToast(`Karte nicht gefunden – ${what} bitte im Karten-Editor speichern`);
      return;
    }
    try {
      await ll.saveConfig({ ...ll.config, views });
      this._rawConfig = apply(old);
      this._showToast(`${what} gespeichert`, "ok");
    } catch (err) {
      this._showToast(`Speichern fehlgeschlagen: ${err?.message || err}`);
    }
  }

  _bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-action]").forEach((b) =>
      b.addEventListener("click", () => {
        const act = b.dataset.action;
        if (act === "silence") this._run("silence");
        else this._request(act);
      })
    );
    root.querySelectorAll("[data-svc]").forEach((b) =>
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const [domain, service] = b.dataset.svc.split(".");
        const entity_id = b.dataset.eid.split(",").filter(Boolean);
        if (entity_id.length) this._hass.callService(domain, service, { entity_id });
      })
    );
    root.querySelectorAll("[data-more]").forEach((b) =>
      b.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: b.dataset.more }, bubbles: true, composed: true }));
      })
    );
    root.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => this._toggle(b.dataset.toggle)));
    root.querySelectorAll("[data-key]").forEach((b) =>
      b.addEventListener("click", () => {
        if (this._keypad.code.length < 12) this._keypad.code += b.dataset.key;
        this._render();
      })
    );
    root.querySelectorAll("[data-pad]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = b.dataset.pad;
        if (p === "cancel") this._keypad = null;
        else if (p === "back") this._keypad.code = this._keypad.code.slice(0, -1);
        else if (p === "ok") {
          const inp = root.querySelector(".codein");
          const code = inp ? inp.value : this._keypad.code;
          if (code) return this._run(this._keypad.action, code);
        }
        this._render();
      })
    );
    const inp = root.querySelector(".codein");
    if (inp) {
      inp.focus();
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inp.value) this._run(this._keypad.action, inp.value);
      });
    }
    this._bindDrag();
    const panic = root.querySelector("[data-hold]");
    if (panic) {
      panic.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        this._startHold(panic);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => panic.addEventListener(ev, () => this._endHold(panic)));
      panic.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  }
}

class SafeHomeCompactCard extends SafeHomeCard {
  static defaultLayout = "compact";
}
class SafeHomeTabletCard extends SafeHomeCard {
  static defaultLayout = "tablet";
}
class SafeHomeCustomCard extends SafeHomeCard {
  static defaultLayout = "custom";
}

class SafeHomeCardEditor extends HTMLElement {
  connectedCallback() {
    this._onOrder = (ev) => {
      if (!this._config || (this._config.layout || this._typeLayout()) !== "custom") return;
      const patch = ev.detail.patch || { layout_order: ev.detail.order };
      const cfg = { ...this._config, ...patch };
      if (cfg.widget_sizes && !Object.keys(cfg.widget_sizes).length) delete cfg.widget_sizes;
      this._emit(cfg);
    };
    window.addEventListener("safe-home-layout-order", this._onOrder);
  }
  disconnectedCallback() {
    window.removeEventListener("safe-home-layout-order", this._onOrder);
  }
  _emit(cfg) {
    this._config = cfg;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
    this._updateOrderInfo();
  }
  _updateOrderInfo() {
    const box = this.querySelector(".sh-order");
    if (!box) return;
    const custom = (this._config.layout || this._typeLayout()) === "custom";
    box.style.display = custom ? "block" : "none";
    box.querySelector('[data-order="reset"]').disabled = !this._config.layout_order;
    if (custom && !this._boardDragging) this._renderBoard();
  }

  // ------------------------------------------------------------ Anordnung (Board)
  _renderBoard() {
    const board = this.querySelector(".sh-board");
    if (!board) return;
    const cfg = { ...CUSTOM_DEFAULTS, ...this._config };
    const order = shNormalizeOrder(this._config.layout_order);
    const keys = ["a", "b", "c"];
    board.innerHTML = keys
      .map((key, ci) => {
        const chips = order[key]
          .map((id, i) => {
            const active = shWidgetActive(id, cfg);
            const si = SH_SIZES.findIndex((x) => x.id === shSizeOf(this._config, id));
            return `<div class="sh-chip ${active ? "" : "off"}" data-w="${id}">
              <b>${esc(shWidgetName(id, this._config))}</b>${active ? "" : "<small>ausgeblendet</small>"}
              <div class="sz" title="Größe">
                <button type="button" data-sz="-1" ${si === 0 ? "disabled" : ""} aria-label="Kleiner">−</button>
                <span class="${si === 2 ? "" : "chg"}">${SH_SIZES[si].label}</span>
                <button type="button" data-sz="1" ${si === SH_SIZES.length - 1 ? "disabled" : ""} aria-label="Größer">+</button>
              </div>
              <div class="arr">
                <button type="button" data-mv="left" ${ci === 0 ? "disabled" : ""} aria-label="Nach links">${icon("left")}</button>
                <button type="button" data-mv="up" ${i === 0 ? "disabled" : ""} aria-label="Nach oben">${icon("up")}</button>
                <button type="button" data-mv="down" ${i === order[key].length - 1 ? "disabled" : ""} aria-label="Nach unten">${icon("down")}</button>
                <button type="button" data-mv="right" ${ci === 2 ? "disabled" : ""} aria-label="Nach rechts">${icon("right")}</button>
              </div>
            </div>`;
          })
          .join("");
        return `<div class="sh-bcol" data-col="${key}"><div class="sh-bcol-h">Spalte ${ci + 1}</div>${chips}</div>`;
      })
      .join("");
    board.querySelectorAll("[data-sz]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.closest(".sh-chip").dataset.w;
        const sizes = shStepSize(this._config, id, Number(btn.dataset.sz));
        const next = { ...this._config, widget_sizes: sizes };
        if (!Object.keys(sizes).length) delete next.widget_sizes;
        this._emit(next);
      })
    );
    board.querySelectorAll("[data-mv]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._moveWidget(btn.closest(".sh-chip").dataset.w, btn.dataset.mv);
      })
    );
    board.querySelectorAll(".sh-chip").forEach((chip) =>
      chip.addEventListener("pointerdown", (e) => {
        if (e.target.closest("button")) return;
        this._boardDragStart(e, chip);
      })
    );
  }

  _saveBoard(order) {
    this._emit({ ...this._config, layout_order: order });
    this._updateOrderInfo();
  }

  _moveWidget(id, dir) {
    const order = shNormalizeOrder(this._config.layout_order);
    const keys = ["a", "b", "c"];
    const ci = keys.findIndex((k) => order[k].includes(id));
    const list = order[keys[ci]];
    const i = list.indexOf(id);
    if (dir === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    else if (dir === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    else if ((dir === "left" && ci > 0) || (dir === "right" && ci < 2)) {
      list.splice(i, 1);
      const target = order[keys[ci + (dir === "left" ? -1 : 1)]];
      target.splice(Math.min(i, target.length), 0, id);
    } else return;
    this._saveBoard(order);
  }

  _boardDragStart(e, chip) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const board = this.querySelector(".sh-board");
    const br = board.getBoundingClientRect();
    const r = chip.getBoundingClientRect();
    const offX = e.clientX - r.left;
    const offY = e.clientY - r.top;
    const startX = e.clientX;
    const startY = e.clientY;
    let ghost = null;
    let ph = null;
    const begin = () => {
      this._boardDragging = true;
      ghost = chip.cloneNode(true);
      ghost.classList.add("ghost");
      Object.assign(ghost.style, { width: `${r.width}px`, left: `${r.left - br.left}px`, top: `${r.top - br.top}px` });
      ph = document.createElement("div");
      ph.className = "sh-ph";
      ph.style.height = `${r.height}px`;
      chip.parentNode.insertBefore(ph, chip);
      chip.style.display = "none";
      board.appendChild(ghost);
    };
    const move = (ev) => {
      if (!ghost) {
        if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 6) return;
        begin();
      }
      const b2 = board.getBoundingClientRect();
      ghost.style.left = `${ev.clientX - offX - b2.left}px`;
      ghost.style.top = `${ev.clientY - offY - b2.top}px`;
      // Spalte nach waagerechter Position wählen
      const cols = [...board.querySelectorAll(".sh-bcol")];
      let target = cols[0];
      let best = Infinity;
      for (const c of cols) {
        const cr = c.getBoundingClientRect();
        const d = Math.abs(ev.clientX - (cr.left + cr.width / 2));
        if (d < best) {
          best = d;
          target = c;
        }
      }
      const items = [...target.querySelectorAll(":scope > .sh-chip")].filter((x) => x !== chip && x !== ghost);
      const phShift = ph.parentNode === target ? ph.getBoundingClientRect().height + 6 : 0;
      const before = items.find((x) => {
        const xb = x.getBoundingClientRect();
        const after = phShift && ph.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING;
        return ev.clientY < (after ? xb.top - phShift : xb.top) + xb.height / 2;
      });
      if (before) {
        if (ph.nextSibling !== before) target.insertBefore(ph, before);
      } else if (target.lastElementChild !== ph) target.appendChild(ph);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (!ghost) return; // nur angetippt
      ph.parentNode.insertBefore(chip, ph);
      ph.remove();
      ghost.remove();
      chip.style.display = "";
      this._boardDragging = false;
      const order = {};
      board.querySelectorAll(".sh-bcol").forEach((c) => {
        order[c.dataset.col] = [...c.querySelectorAll(":scope > .sh-chip")].map((x) => x.dataset.w);
      });
      this._saveBoard(order);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  // ------------------------------------------------------------ Hintergrundfarbe (RGB)
  _setupColor() {
    const box = this.querySelector(".sh-color");
    box.querySelector('[data-color="reset"]').addEventListener("click", () => {
      const cfg = { ...this._config };
      delete cfg.background_color;
      clearTimeout(this._colorEmitT);
      this._emit(cfg);
      this._updateColor();
    });
    this._colorForm = document.createElement("ha-form");
    this._colorForm.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
    this._colorForm.addEventListener("value-changed", (ev) => {
      const v = ev.detail.value;
      this._colorForm.data = v;
      const rgb = [v.bg_red, v.bg_green, v.bg_blue].map((x) => Math.max(0, Math.min(255, Math.round(Number(x) || 0))));
      this._config = { ...this._config, background_color: rgb };
      this._paintColorPreview();
      clearTimeout(this._colorEmitT);
      this._colorEmitT = setTimeout(() => this._emit(this._config), 250);
    });
    box.querySelector(".sh-color-form").appendChild(this._colorForm);
  }

  _paintColorPreview() {
    const prev = this.querySelector(".sh-color-prev");
    if (!prev) return;
    const css = shColorCard(this._config);
    prev.style.cssText = css
      ? css.split(";").filter((x) => x.startsWith("background")).join(";")
      : "background:radial-gradient(120% 80% at 100% 0%, #123a9a 0%, transparent 55%), linear-gradient(160deg,#0b2463,#071538 70%)";
  }

  _updateColor() {
    if (!this._colorForm) return;
    const c = Array.isArray(this._config.background_color) ? this._config.background_color : [11, 36, 99];
    this._colorForm.hass = this._hass;
    this._colorForm.data = { bg_red: c[0], bg_green: c[1], bg_blue: c[2] };
    const slider = { number: { min: 0, max: 255, step: 1, mode: "slider" } };
    this._colorForm.schema = [
      { name: "bg_red", selector: slider },
      { name: "bg_green", selector: slider },
      { name: "bg_blue", selector: slider },
    ];
    this.querySelector('[data-color="reset"]').disabled = !this._config.background_color;
    this._paintColorPreview();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._colorForm) this._colorForm.hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }
  _typeLayout() {
    const t = String(this._config?.type || "").replace("custom:", "");
    return { "safe-home-compact-card": "compact", "safe-home-tablet-card": "tablet", "safe-home-custom-card": "custom" }[t] || "standard";
  }
  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this.innerHTML = `<div class="sh-ed"></div>
        <div class="sh-order" style="display:none">
          <div class="sh-bg-h">Anordnung</div>
          <div class="sh-board-hint">Widgets greifen und zwischen die Spalten ziehen – oder mit den Pfeilen verschieben. Auf dem Smartphone werden die Spalten untereinander angezeigt (erst Spalte 1, dann 2, dann 3).</div>
          <div class="sh-board"></div>
          <div class="sh-bg-btns" style="margin-top:10px"><button type="button" class="sh-bg-btn" data-order="reset">Standard-Anordnung</button></div>
        </div>
        <div class="sh-bg sh-color">
          <div class="sh-bg-h">Hintergrundfarbe</div>
          <div class="sh-bg-row">
            <div class="sh-color-prev"></div>
            <div class="sh-bg-btns"><button type="button" class="sh-bg-btn" data-color="reset">Standard-Dunkelblau</button></div>
          </div>
          <div class="sh-color-form"></div>
          <div class="sh-bg-hint">Flächen, Linien, Schrift und Akzentfarbe passen sich automatisch an. Sehr helle Farben werden abgedunkelt, damit die Schrift lesbar bleibt.</div>
        </div>
        <style>
          .sh-order{margin-top:16px;padding:14px;border-radius:12px;border:1px solid var(--divider-color,rgba(127,127,127,.3))}
          .sh-board-hint{font-size:12px;color:var(--secondary-text-color,#888);margin-bottom:10px;line-height:1.4}
          .sh-board{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;user-select:none;-webkit-user-select:none}
          .sh-bcol{display:flex;flex-direction:column;gap:6px;min-height:120px;padding:8px;border-radius:10px;background:rgba(127,127,127,.08);border:1px dashed rgba(127,127,127,.35)}
          .sh-bcol-h{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--secondary-text-color,#888);margin-bottom:2px}
          .sh-chip{position:relative;display:flex;flex-direction:column;gap:4px;padding:7px 8px;border-radius:9px;background:var(--card-background-color,#fff);border:1px solid rgba(127,127,127,.35);font-size:12.5px;cursor:grab;touch-action:none}
          .sh-chip.off{opacity:.5}
          .sh-chip b{font-weight:600;line-height:1.25;word-break:break-word}
          .sh-chip small{font-size:10.5px;color:var(--secondary-text-color,#888)}
          .sh-chip .arr{display:flex;gap:3px}
          .sh-chip .arr button{flex:1;min-width:0;padding:2px 0;display:grid;place-items:center;border-radius:6px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;font-size:12px;line-height:1.3;cursor:pointer}
          .sh-chip .arr button .ic{width:14px;height:14px;stroke-width:2.4}
          .sh-chip .arr button[disabled]{opacity:.3;cursor:default}
          .sh-chip .sz{display:flex;align-items:center;gap:3px}
          .sh-chip .sz button{flex:none;width:24px;height:22px;padding:0;display:grid;place-items:center;border-radius:6px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:700;line-height:1;cursor:pointer}
          .sh-chip .sz button[disabled]{opacity:.3;cursor:default}
          .sh-chip .sz span{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--secondary-text-color,#888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .sh-chip .sz span.chg{color:var(--primary-color,#3b7bff);font-weight:700}
          .sh-chip.ghost{position:absolute;z-index:5;pointer-events:none;box-shadow:0 10px 24px rgba(0,0,0,.3);transform:rotate(1.5deg)}
          .sh-ph{border-radius:9px;border:2px dashed var(--primary-color,#3b7bff);background:rgba(59,123,255,.08)}
          .sh-bg{margin-top:16px;padding:14px;border-radius:12px;border:1px solid var(--divider-color,rgba(127,127,127,.3))}
          .sh-bg-h{font-weight:600;margin-bottom:10px}
          .sh-color-prev{width:120px;height:72px;border-radius:10px;border:1px solid rgba(127,127,127,.35);flex:none}
          .sh-bg-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
          .sh-bg-btns{display:flex;gap:8px;flex-wrap:wrap}
          .sh-bg-btn{cursor:pointer;padding:8px 12px;border-radius:8px;border:1px solid var(--primary-color,#3b7bff);background:transparent;color:var(--primary-text-color,inherit);font:inherit;font-size:13px}
          .sh-bg-btn[disabled]{opacity:.5;cursor:default}
          .sh-bg-hint{font-size:12px;margin-top:6px;color:var(--secondary-text-color,#888)}
        </style>
        <p style="margin:16px 0 0;font-size:12px;opacity:.7;text-align:center">Safe Home ${SH_VERSION} (Build ${SH_BUILD}) · Mit ❤️ entwickelt in Deutschland · <a href="https://github.com/digital7even" target="_blank" rel="noopener">Digital7even</a></p>`;
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
      this._form.computeHelper = (s) => EDITOR_HELPERS[s.name];
      this._form.addEventListener("value-changed", (ev) => {
        // Vergleich mit eigener Kopie: Neuere Home-Assistant-Versionen aktualisieren form.data
        // bereits *vor* dem Ereignis – ein Vergleich damit fände nie eine Änderung.
        const next = { ...(ev.detail.value || {}) };
        const cfg = shMergeChanged(this._config, this._formBase || {}, next);
        this._formBase = next;
        this._form.data = next;
        if (cfg.layout === this._typeLayout()) delete cfg.layout;
        const relayout = (cfg.layout || this._typeLayout()) !== (this._config.layout || this._typeLayout());
        this._emit(cfg);
        if (relayout) this._render();
      });
      this.querySelector(".sh-ed").appendChild(this._form);
      this._setupColor();
      this.querySelector('[data-order="reset"]').addEventListener("click", () => {
        const cfg = { ...this._config };
        delete cfg.layout_order;
        this._emit(cfg);
      });
    }
    this._updateOrderInfo();
    this._updateColor();
    const layout = this._config.layout || this._typeLayout();
    this._form.hass = this._hass;
    this._form.data = this._formBase = {
      show_automation: true, show_sensors: true, show_events: true, show_panic: true,
      ...(layout === "custom" ? CUSTOM_DEFAULTS : {}),
      ...this._config,
      layout,
    };
    const b = (name) => ({ name, selector: { boolean: {} } });
    const ents = (name, filter) => ({ name, selector: { entity: { multiple: true, filter } } });
    const base = [
      { name: "entity", required: true, selector: { entity: { domain: "alarm_control_panel", integration: "safe_home" } } },
      { name: "title", selector: { text: {} } },
      {
        name: "layout",
        selector: {
          select: {
            mode: "box",
            options: [
              { value: "standard", label: "Standard" },
              { value: "compact", label: "Kompakt" },
              { value: "tablet", label: "Tablet" },
              { value: "custom", label: "Custom" },
            ],
          },
        },
      },
    ];
    if (layout === "compact") {
      this._form.schema = base;
      return;
    }
    const alarmPart = [
      { type: "grid", name: "", schema: [b("show_automation"), b("show_sensors"), b("show_events"), b("show_panic")] },
      { name: "events_count", selector: { number: { min: 1, max: 15, mode: "box" } } },
    ];
    if (layout !== "custom") {
      this._form.schema = [...base, ...alarmPart];
      return;
    }
    const exp = (title, icon, schema) => ({ type: "expandable", name: "", title, icon, flatten: true, schema });
    this._form.schema = [
      ...base,
      {
        name: "device",
        selector: {
          select: {
            mode: "box",
            options: [
              { value: "auto", label: "Automatisch" },
              { value: "phone", label: "Smartphone" },
              { value: "tablet", label: "Tablet" },
            ],
          },
        },
      },
      b("fullscreen"),
      exp("Kopfbereich & Design", "mdi:palette", [
        b("show_clock"),
        {
          name: "accent",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: "Automatisch (passend zur Hintergrundfarbe)" },
                { value: "blue", label: "Blau" },
                { value: "indigo", label: "Indigo" },
                { value: "cyan", label: "Türkis" },
                { value: "emerald", label: "Grün" },
                { value: "amber", label: "Bernstein" },
                { value: "red", label: "Rot" },
              ],
            },
          },
        },
      ]),
      exp("Personen", "mdi:account-group", [b("show_people"), ents("people", { domain: "person" })]),
      exp("Wetter", "mdi:weather-partly-cloudy", [
        b("show_weather"),
        { name: "weather_entity", selector: { entity: { domain: "weather" } } },
        { name: "weather_name", selector: { text: {} } },
        b("show_forecast"),
        { name: "forecast_days", selector: { number: { min: 2, max: 8, mode: "slider" } } },
      ]),
      exp("Raumklima", "mdi:thermometer", [
        b("show_climate"),
        ents("climate_entities", [
          { domain: "sensor", device_class: "temperature" },
          { domain: "sensor", device_class: "humidity" },
        ]),
      ]),
      exp("Rollos", "mdi:window-shutter", [
        b("show_covers"),
        ents("cover_entities", { domain: "cover" }),
        { type: "grid", name: "", schema: [b("covers_group_by_area"), b("show_cover_all")] },
      ]),
      exp("Licht & Szenen", "mdi:lightbulb-group", [
        b("show_lights"),
        ents("light_entities", [{ domain: "light" }, { domain: "switch" }]),
        b("show_scenes"),
        ents("scene_entities", [{ domain: "scene" }, { domain: "script" }]),
      ]),
      exp("Kameras", "mdi:cctv", [
        b("show_cameras"),
        ents("camera_entities", { domain: "camera" }),
        { name: "camera_refresh", selector: { number: { min: 2, max: 120, mode: "box", unit_of_measurement: "s" } } },
      ]),
      exp("Kraftstoffpreise", "mdi:gas-station", [
        b("show_fuel"),
        { name: "fuel_title", selector: { text: {} } },
        ents("fuel_entities", { domain: "sensor" }),
        b("fuel_sort"),
      ]),
      ...SH_EMBED_SLOTS.map((n) =>
        exp(`Eigenes Widget ${n}${String(this._config[`custom_${n}_title`] || "").trim() ? ` · ${String(this._config[`custom_${n}_title`]).trim()}` : ""}`, "mdi:code-braces", [
          b(`show_custom_${n}`),
          { name: `custom_${n}_title`, selector: { text: {} } },
          { name: `custom_${n}_card`, selector: { object: {} } },
        ])
      ),
      exp("Alarmanlage", "mdi:shield-home", alarmPart),
    ];
  }
}

  return [
    ["safe-home-card", SafeHomeCard],
    ["safe-home-compact-card", SafeHomeCompactCard],
    ["safe-home-tablet-card", SafeHomeTabletCard],
    ["safe-home-custom-card", SafeHomeCustomCard],
    ["safe-home-card-editor", SafeHomeCardEditor],
  ];
}

const SH_TAGS = ["safe-home-card", "safe-home-compact-card", "safe-home-tablet-card", "safe-home-custom-card", "safe-home-card-editor"];
let shRegistry = null;

/** Im aktuell gültigen Verzeichnis anmelden – mehrfach aufrufbar, meldet nur Fehlendes an. */
function shRegister() {
  const reg = window.customElements;
  if (!reg) return;
  if (reg === shRegistry && SH_TAGS.every((t) => reg.get(t))) return;
  if (SH_TAGS.some((t) => !reg.get(t))) {
    let defs;
    try {
      defs = shCreateClasses(window.HTMLElement);
    } catch (err) {
      console.warn("Safe Home: Karten konnten nicht erzeugt werden", err);
      return;
    }
    for (const [name, cls] of defs) {
      if (reg.get(name)) continue;
      try {
        reg.define(name, cls);
      } catch (err) {
        console.warn(`Safe Home: Anmeldung von <${name}> fehlgeschlagen`, err);
      }
    }
  }
  shRegistry = reg;
}

shRegister();
// Nachträglichen Austausch des Verzeichnisses erkennen und neu anmelden.
// Home Assistant baut betroffene Karten danach selbst neu auf.
for (const ms of [0, 250, 1000, 2500, 5000, 10000]) setTimeout(shRegister, ms);
{
  let ticks = 0;
  const watch = setInterval(() => {
    if (window.customElements !== shRegistry || !window.customElements.get("safe-home-card")) shRegister();
    if (++ticks >= 120) clearInterval(watch);
  }, 1000);
}
try {
  window.customElements.whenDefined("home-assistant").then(shRegister);
} catch (e) {
  /* kein Home-Assistant-Frontend */
}

window.customCards = window.customCards || [];
const SH_CARDS = [
  {
    type: "safe-home-card",
    name: "Safe Home",
    description: "Standard-Layout: Status, Modi, Automatik, Sensoren, Protokoll und Panik-Taste.",
    preview: true,
    documentationURL: "https://github.com/digital7even/safe_home",
  },
  {
    type: "safe-home-compact-card",
    name: "Safe Home – Kompakt",
    description: "Nur Status und die Modi Zuhause, Unterwegs, Nacht – für kompakte Dashboards.",
    preview: true,
    documentationURL: "https://github.com/digital7even/safe_home",
  },
  {
    type: "safe-home-tablet-card",
    name: "Safe Home – Tablet",
    description: "Alle Infos in einem breiten, responsiven Layout für Wand-Tablets.",
    preview: true,
    documentationURL: "https://github.com/digital7even/safe_home",
  },
  {
    type: "safe-home-custom-card",
    name: "Safe Home – Custom",
    description: "Vollbild für Smartphone oder Tablet mit Personen, Wetter, Raumklima, Rollos, Licht, Szenen und Kameras – alles einzeln zuschaltbar.",
    preview: true,
    documentationURL: "https://github.com/digital7even/safe_home",
  },
];
for (const c of SH_CARDS) if (!window.customCards.some((x) => x.type === c.type)) window.customCards.push(c);

console.info(
  `%c SAFE HOME %c ${SH_VERSION} (Build ${SH_BUILD}) – Mit ❤️ entwickelt in Deutschland von Digital7even `,
  "background:#0b2463;color:#fff;font-weight:700;padding:3px 6px;border-radius:4px 0 0 4px",
  "background:#e8213b;color:#fff;padding:3px 6px;border-radius:0 4px 4px 0"
);
