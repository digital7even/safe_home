/*!
 * Safe Home – Einstellungsseite in der Seitenleiste
 * Mit ❤️ entwickelt in Deutschland von Digital7even
 * https://github.com/digital7even
 */
const PANEL_VERSION = "1.0.0";
const P_LOGO = new URL("./logo-white.png", import.meta.url).href;

const PI = {
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8.2-8 9.3C7.5 20.2 4 17 4 12V6z"/>',
  door: '<path d="M6 21V3h12v18"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".6" fill="currentColor"/>',
  window: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
  motion: '<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6 2.5 2v4M7 12l3-4 4 1 2 3 3 1"/><path d="m11.5 15 1-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  alarm: '<path d="M6.5 18v-5.5a5.5 5.5 0 0 1 11 0V18"/><path d="M4 18h16v3H4z"/><path d="M12 2v2.2M4.4 5.4l1.5 1.5M19.6 5.4l-1.5 1.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.8 2.8L16 9.5"/>',
  warn: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.2M12 17.2v.3"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  night: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  away: '<path d="M12 3 20 6v6c0 5-3.5 8.2-8 9.3C7.5 20.2 4 17 4 12V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10.2 11V9.4a1.8 1.8 0 0 1 3.6 0V11"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9.5 2.5h5"/>',
};
const pi = (n, cls = "") =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PI[n] || ""}</svg>`;
const pesc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clone = (o) => JSON.parse(JSON.stringify(o));

const TABS = [
  { id: "overview", label: "Übersicht", icon: "shield" },
  { id: "sensors", label: "Sensoren", icon: "door" },
  { id: "delays", label: "Zeiten", icon: "timer" },
  { id: "actions", label: "Alarm-Aktionen", icon: "alarm" },
  { id: "automation", label: "Automatik", icon: "pin" },
  { id: "security", label: "Sicherheit", icon: "lock" },
  { id: "log", label: "Protokoll", icon: "list" },
  { id: "info", label: "Info", icon: "info" },
];

const SUGGEST_CLASSES = ["door", "window", "opening", "garage_door", "motion", "occupancy", "presence", "vibration"];
const STATE_TEXT = {
  door: ["Geschlossen", "Offen"], window: ["Geschlossen", "Offen"], opening: ["Geschlossen", "Offen"],
  garage_door: ["Geschlossen", "Offen"], motion: ["Ruhe", "Bewegung"], occupancy: ["Frei", "Belegt"],
  presence: ["Abwesend", "Anwesend"], vibration: ["Ruhe", "Erschütterung"],
};

const LABELS = {
  name: "Name der Alarmanlage",
  code: "PIN-Code (optional, mind. 4 Zeichen)",
  code_arm_required: "PIN auch zum Scharfschalten verlangen",
  notify_wrong_code: "Bei falscher PIN-Eingabe benachrichtigen",
  open_sensor_policy: "Offene Sensoren beim Scharfschalten",
  tamper_notify: "Melden, wenn ein Sensor im scharfen Zustand nicht mehr erreichbar ist",
  exit_delay_away: "Ausgangsverzögerung – Unterwegs",
  entry_delay_away: "Eingangsverzögerung – Unterwegs",
  exit_delay_night: "Ausgangsverzögerung – Nacht",
  entry_delay_night: "Eingangsverzögerung – Nacht",
  trigger_time: "Alarmdauer (Sirene)",
  rearm_after_trigger: "Nach Ablauf der Alarmdauer wieder scharf schalten",
  sirens: "Sirenen / akustische Signalgeber",
  alarm_lights: "Alarmbeleuchtung (wird rot eingeschaltet)",
  notify_services: "Benachrichtigungsdienste",
  notify_state_changes: "Auch beim Scharf- und Unscharfschalten benachrichtigen",
  critical_notifications: "Alarm als kritische Benachrichtigung (umgeht Lautlos)",
  notification_disarm_action: "„Entschärfen“-Taste in der Alarm-Benachrichtigung",
  cameras: "Kameras (Schnappschuss in der Benachrichtigung)",
  tts_entity: "Sprachausgabe-Dienst (TTS)",
  media_players: "Lautsprecher für Ansagen",
  persons: "Personen für die Home-Zone-Automatik",
  auto_arm: "Automatisch scharf, wenn alle die Home-Zone verlassen",
  auto_arm_delay: "Wartezeit vor dem automatischen Scharfschalten",
  auto_disarm: "Automatisch unscharf, wenn jemand nach Hause kommt",
  night_auto: "Nachtmodus nach Zeitplan",
  night_start: "Nachtmodus Beginn",
  night_end: "Nachtmodus Ende",
  night_only_when_home: "Nachtmodus nur, wenn jemand zuhause ist",
};
const HELPERS = {
  trigger_time: "0 = Sirene läuft, bis die Alarmanlage ausgeschaltet wird.",
  notify_services: "Z. B. mobile_app_mein_handy. Eigene Dienstnamen können eingetippt werden.",
  critical_notifications: "Companion App: Alarm klingelt auch bei Lautlos und Fokus.",
  notification_disarm_action: "Zum Entschärfen muss das Handy entsperrt werden.",
  auto_arm_delay: "Schützt vor kurzen GPS-Aussetzern. Die Ausgangsverzögerung entfällt hier.",
  code: "Leer lassen für Bedienung ohne PIN.",
};

const sec = (max = 3600) => ({ number: { min: 0, max, step: 1, mode: "box", unit_of_measurement: "s" } });
const bool = { boolean: {} };
const ents = (domain, multiple = true) => ({ entity: { multiple, filter: [].concat(domain).map((d) => ({ domain: d })) } });

class SafeHomePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tab = this._readTab();
    this._entries = null;
    this._entryId = null;
    this._data = null;
    this._draft = null;
    this._title = "";
    this._errors = {};
    this._search = "";
    this._logFilter = "all";
    this._toast = null;
    this._forms = [];
    this._busy = false;
    this._unload = (e) => {
      if (this._dirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._init();
    else this._updateLive();
  }
  get hass() {
    return this._hass;
  }
  set narrow(v) {
    const changed = this._narrow !== v;
    this._narrow = v;
    if (changed && this._data) this._render();
  }
  set panel(v) {
    this._panel = v;
    // Karten mitladen, falls der Browser sie noch nicht kennt (exakt gleiche URL wie die Integration)
    // Exakt gleiche URL wie die Integration -> Datei wird nur einmal ausgeführt
    const url = v?.config?.card_url;
    if (url && !customElements.get("safe-home-card")) import(url).catch(() => {});
  }
  set route(v) {
    this._route = v;
  }

  connectedCallback() {
    window.addEventListener("beforeunload", this._unload);
  }
  disconnectedCallback() {
    window.removeEventListener("beforeunload", this._unload);
  }

  _readTab() {
    try {
      return localStorage.getItem("safe_home_panel_tab") || "overview";
    } catch (e) {
      return "overview";
    }
  }
  _store(key, v) {
    try {
      localStorage.setItem(key, v);
    } catch (e) {
      /* ignore */
    }
  }

  // ------------------------------------------------------------------ Daten
  async _ws(msg) {
    return this._hass.callWS(msg);
  }

  async _init() {
    this._renderShell('<div class="center"><div class="spinner"></div></div>');
    this._formReady = ensureHaForm();
    try {
      const res = await this._ws({ type: "safe_home/entries" });
      this._entries = res.entries;
      if (!this._entries.length) {
        this._renderEmpty();
        return;
      }
      let stored = null;
      try {
        stored = localStorage.getItem("safe_home_panel_entry");
      } catch (e) {
        /* ignore */
      }
      const pick = this._entries.find((e) => e.entry_id === stored) || this._entries[0];
      await this._load(pick.entry_id);
    } catch (err) {
      this._renderShell(`<div class="center err">${pi("warn")}<p>Safe Home konnte nicht geladen werden.<br><small>${pesc(err?.message || err)}</small></p></div>`);
    }
  }

  async _load(entryId) {
    this._entryId = entryId;
    this._store("safe_home_panel_entry", entryId);
    const data = await this._ws({ type: "safe_home/config", entry_id: entryId });
    this._data = data;
    this._draft = clone(data.options);
    this._title = data.title;
    this._errors = {};
    this._hasForm = await this._formReady;
    await this._loadResource(false);
    this._render();
  }

  async _loadResource(register) {
    try {
      this._resource = await this._ws({ type: "safe_home/resource", register });
    } catch (err) {
      this._resource = { state: "error", message: err?.message || "Status konnte nicht abgefragt werden", url: "/safe_home_static/safe-home-card.js" };
    }
  }

  _dirty() {
    if (!this._data) return false;
    return JSON.stringify(this._draft) !== JSON.stringify(this._data.options) || this._title !== this._data.title;
  }

  async _save() {
    if (this._busy) return;
    this._busy = true;
    this._updateSaveBar();
    try {
      const res = await this._ws({ type: "safe_home/save_config", entry_id: this._entryId, options: this._draft, title: this._title });
      if (!res.success) {
        this._errors = res.errors || {};
        this._showToast("Bitte die markierten Angaben prüfen", "err");
        this._render();
        return;
      }
      this._errors = {};
      this._data.options = clone(res.options);
      this._draft = clone(res.options);
      this._data.title = this._title;
      this._showToast("Gespeichert – Safe Home wird neu geladen", "ok");
      setTimeout(() => this._load(this._entryId).catch(() => {}), 1500);
      this._render();
    } catch (err) {
      this._showToast(err?.message || "Speichern fehlgeschlagen", "err");
    } finally {
      this._busy = false;
      this._updateSaveBar();
    }
  }

  _discard() {
    this._draft = clone(this._data.options);
    this._title = this._data.title;
    this._errors = {};
    this._render();
  }

  async _test(kind) {
    if (this._dirty()) {
      this._showToast("Bitte zuerst speichern – getestet werden die gespeicherten Einstellungen", "err");
      return;
    }
    try {
      const res = await this._ws({ type: "safe_home/test", entry_id: this._entryId, kind });
      this._showToast(res.message, "ok");
    } catch (err) {
      this._showToast(err?.message || "Test fehlgeschlagen", "err");
    }
  }

  _set(key, value) {
    if (key === "name") this._title = value || "";
    else this._draft[key] = value;
    delete this._errors[key];
    this._updateSaveBar();
  }

  _showToast(msg, kind = "ok") {
    this._toast = { msg, kind, until: Date.now() + 3800 };
    this._paintToast();
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => {
      this._toast = null;
      this._paintToast();
    }, 3800);
  }

  _paintToast() {
    const h = this.shadowRoot.querySelector(".toast-host");
    if (!h) return;
    const t = this._toast && this._toast.until > Date.now() ? this._toast : null;
    h.innerHTML = t ? `<div class="toast ${t.kind}">${pi(t.kind === "ok" ? "check" : "warn")}${pesc(t.msg)}</div>` : "";
  }

  // ----------------------------------------------------------------- Rendern
  _renderShell(content) {
    this.shadowRoot.innerHTML = `<style>${PANEL_STYLE}</style><div class="app ${this._narrow ? "is-narrow" : ""}"><div class="glow"></div>${this._headerHtml()}${content}</div>`;
    this._bindHeader();
  }

  _headerHtml() {
    const st = this._data?.entity_id ? this._hass?.states[this._data.entity_id] : null;
    const info = st ? STATE_PILL[st.state] || STATE_PILL.unknown : null;
    const select =
      this._entries && this._entries.length > 1
        ? `<select class="inst" aria-label="Instanz">${this._entries
            .map((e) => `<option value="${pesc(e.entry_id)}" ${e.entry_id === this._entryId ? "selected" : ""}>${pesc(e.title)}</option>`)
            .join("")}</select>`
        : "";
    return `
      <header class="top">
        ${this._narrow ? `<button class="iconbtn menu" aria-label="Menü">${pi("menu")}</button>` : ""}
        <img class="logo" src="${P_LOGO}" alt="">
        <div class="ttl"><h1>Safe Home</h1><span>${pesc(this._data?.title || "Alarmanlage")} · Einstellungen</span></div>
        ${select}
        ${info ? `<span class="pill" style="--tone:${info.c}">${pesc(info.l)}</span>` : ""}
      </header>`;
  }

  _bindHeader() {
    const root = this.shadowRoot;
    root.querySelector(".menu")?.addEventListener("click", () =>
      this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }))
    );
    root.querySelector(".inst")?.addEventListener("change", async (e) => {
      if (this._dirty() && !confirm("Ungespeicherte Änderungen verwerfen?")) {
        e.target.value = this._entryId;
        return;
      }
      await this._load(e.target.value);
    });
  }

  _renderEmpty() {
    this._renderShell(`
      <div class="center empty">
        <img src="${P_LOGO}" alt="" class="biglogo">
        <h2>Noch keine Alarmanlage eingerichtet</h2>
        <p>Füge Safe Home über die Integrationen hinzu – danach kannst du hier alles bequem einstellen.</p>
        <a class="btn primary" href="/config/integrations/dashboard/add?domain=safe_home">${pi("plus")} Safe Home einrichten</a>
      </div>`);
  }

  _render() {
    if (!this._data) return;
    const tab = TABS.find((t) => t.id === this._tab) ? this._tab : "overview";
    const nav = TABS.map(
      (t) => `<button class="tab ${t.id === tab ? "active" : ""}" data-tab="${t.id}">${pi(t.icon)}<span>${t.label}</span>${
        this._tabErrors(t.id) ? '<i class="dot-err"></i>' : ""
      }</button>`
    ).join("");
    this._renderShell(`
      <div class="body ${this._narrow ? "narrow" : ""}">
        <nav class="tabs">${nav}</nav>
        <main class="content" data-tab="${tab}">${this._errorsBanner()}${this._tabHtml(tab)}</main>
      </div>
      <div class="savebar"></div>
      <div class="toast-host"></div>`);
    this._bindTab(tab);
    this._paintToast();
    this.shadowRoot.querySelectorAll("[data-tab]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!b.classList.contains("tab")) return;
        this._tab = b.dataset.tab;
        this._store("safe_home_panel_tab", this._tab);
        this._render();
        this.shadowRoot.querySelector(".content")?.scrollTo?.(0, 0);
      })
    );
    this._updateSaveBar();
  }

  _tabErrors(tab) {
    const keys = Object.keys(this._errors);
    const map = {
      sensors: ["away_sensors", "night_sensors", "delayed_sensors", "base"],
      delays: ["exit_delay_away", "entry_delay_away", "exit_delay_night", "entry_delay_night", "trigger_time"],
      actions: ["sirens", "alarm_lights", "notify_services", "cameras", "tts_entity", "media_players"],
      automation: ["persons", "auto_arm_delay", "night_start", "night_end"],
      security: ["code"],
    };
    return keys.some((k) => (map[tab] || []).includes(k));
  }

  _errorsBanner() {
    const e = Object.entries(this._errors);
    if (!e.length) return "";
    return `<div class="banner err">${pi("warn")}<div><b>Nicht gespeichert:</b><ul>${e
      .map(([k, v]) => `<li>${pesc(LABELS[k] || (k === "base" ? "Sensoren" : k))}: ${pesc(v)}</li>`)
      .join("")}</ul></div></div>`;
  }

  _updateSaveBar() {
    const bar = this.shadowRoot.querySelector(".savebar");
    if (!bar) return;
    const dirty = this._dirty();
    bar.classList.toggle("show", dirty);
    bar.innerHTML = dirty
      ? `<span>${pi("warn")} Ungespeicherte Änderungen</span>
         <button class="btn ghost" data-sb="discard">Verwerfen</button>
         <button class="btn primary" data-sb="save" ${this._busy ? "disabled" : ""}>${this._busy ? "Speichert …" : "Speichern"}</button>`
      : "";
    bar.querySelector('[data-sb="discard"]')?.addEventListener("click", () => this._discard());
    bar.querySelector('[data-sb="save"]')?.addEventListener("click", () => this._save());
  }

  _tabHtml(tab) {
    switch (tab) {
      case "overview": return this._overviewHtml();
      case "sensors": return this._sensorsHtml();
      case "delays": return this._delaysHtml();
      case "actions": return this._actionsHtml();
      case "automation": return this._automationHtml();
      case "security": return this._securityHtml();
      case "log": return this._logHtml();
      default: return this._infoHtml();
    }
  }

  _section(title, sub, body, cls = "") {
    return `<section class="box ${cls}"><div class="box-h"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${body}</section>`;
  }

  // -------------------------------------------------------------- Übersicht
  _overviewHtml() {
    const a = this._hass.states[this._data.entity_id]?.attributes || {};
    const o = this._data.options;
    const monitored = new Set([...(o.away_sensors || []), ...(o.night_sensors || [])]);
    const lastAlarm = (this._data.events || []).find((e) => e.type === "triggered");
    const tiles = [
      { ic: "door", v: monitored.size, l: "Überwachte Sensoren", go: "sensors" },
      { ic: "warn", v: (a.open_sensors || []).length, l: "Aktuell offen", go: "sensors", warn: (a.open_sensors || []).length > 0 },
      { ic: "person", v: `${a.people_home ?? 0}/${(o.persons || []).length}`, l: "Personen zuhause", go: "automation" },
      { ic: "alarm", v: lastAlarm ? this._fmt(lastAlarm.time) : "–", l: "Letzter Alarm", go: "log", small: true },
    ];
    const hints = [];
    if (this._resource && this._resource.state !== "ok")
      hints.push(["warn", "Die Karte ist noch nicht als Dashboard-Ressource eingetragen – dadurch kann beim Start der App „Konfigurationsfehler“ erscheinen.", "info"]);
    if (!(o.notify_services || []).length) hints.push(["bell", "Noch kein Benachrichtigungsdienst – du würdest von einem Alarm unterwegs nichts erfahren.", "actions"]);
    if (!(o.sirens || []).length) hints.push(["speaker", "Keine Sirene ausgewählt – ein Alarm wäre vor Ort nicht hörbar.", "actions"]);
    if (!(o.persons || []).length) hints.push(["pin", "Keine Personen ausgewählt – die Home-Zone-Automatik ist dadurch inaktiv.", "automation"]);
    if (!(o.delayed_sensors || []).length && (o.away_sensors || []).length) hints.push(["timer", "Kein Sensor mit Eingangsverzögerung – beim Heimkommen löst der erste Sensor sofort aus.", "sensors"]);
    if (!o.code) hints.push(["lock", "Kein PIN gesetzt – jeder mit Zugriff aufs Dashboard kann entschärfen.", "security"]);
    return `
      <div class="tiles">${tiles
        .map((t) => `<button class="tile ${t.warn ? "warn" : ""}" data-go="${t.go}">${pi(t.ic)}<b class="${t.small ? "sm" : ""}">${pesc(t.v)}</b><span>${t.l}</span></button>`)
        .join("")}</div>
      ${
        hints.length
          ? this._section("Empfehlungen", "Kleine Lücken in der Konfiguration", `<div class="hints">${hints
              .map(([ic, txt, go]) => `<button class="hint" data-go="${go}">${pi(ic)}<span>${txt}</span>${pi("ext", "go")}</button>`)
              .join("")}</div>`)
          : this._section("Alles eingerichtet", "", `<div class="allgood">${pi("check")} Sensoren, Benachrichtigungen, Sirene, Automatik und PIN sind konfiguriert.</div>`)
      }
      <div class="cardhost"></div>`;
  }

  // --------------------------------------------------------------- Sensoren
  _sensorRows() {
    const d = this._draft;
    const ids = [...new Set([...(d.away_sensors || []), ...(d.night_sensors || []), ...(d.delayed_sensors || [])])];
    return ids;
  }

  _sensorsHtml() {
    const d = this._draft;
    const ids = this._sensorRows();
    const q = this._search.toLowerCase();
    const shown = ids.filter((e) => !q || e.includes(q) || this._name(e).toLowerCase().includes(q));
    const suggestions = this._suggestions();
    const rows = shown
      .map((eid) => {
        const s = this._hass.states[eid];
        const dc = s?.attributes?.device_class;
        const ic = ["window"].includes(dc) ? "window" : ["motion", "occupancy", "presence", "vibration"].includes(dc) ? "motion" : "door";
        const sw = (key, on, label) =>
          `<button class="sw ${on ? "on" : ""}" data-sw="${key}" data-eid="${pesc(eid)}" role="switch" aria-checked="${on}" aria-label="${label}"><i></i></button>`;
        return `<div class="srow" data-eid="${pesc(eid)}">
          <div class="s-name">${pi(ic)}<div><b>${pesc(this._name(eid))}</b><small>${pesc(eid)}${this._area(eid) ? ` · ${pesc(this._area(eid))}` : ""}</small></div></div>
          <div class="s-state" data-live="${pesc(eid)}">${this._stateChip(eid)}</div>
          <div class="s-sw">${sw("away_sensors", (d.away_sensors || []).includes(eid), "Unterwegs")}</div>
          <div class="s-sw">${sw("night_sensors", (d.night_sensors || []).includes(eid), "Nacht")}</div>
          <div class="s-sw">${sw("delayed_sensors", (d.delayed_sensors || []).includes(eid), "Eingangsverzögerung")}</div>
          <div class="s-del"><button class="iconbtn" data-del="${pesc(eid)}" aria-label="Entfernen">${pi("trash")}</button></div>
        </div>`;
      })
      .join("");
    const counts = `<span class="chip">${(d.away_sensors || []).length} Unterwegs</span><span class="chip">${(d.night_sensors || []).length} Nacht</span><span class="chip">${(d.delayed_sensors || []).length} mit Verzögerung</span>`;
    return `
      ${this._section(
        "Überwachte Sensoren",
        "Lege für jeden Sensor fest, in welchem Modus er überwacht wird. Sensoren mit Eingangsverzögerung geben dir beim Heimkommen Zeit zum Ausschalten – alle anderen lösen sofort aus.",
        `<div class="toolbar">
          <label class="search">${pi("search")}<input type="search" placeholder="Sensor suchen" value="${pesc(this._search)}"></label>
          <div class="addhost"></div>
          ${suggestions.length ? `<button class="btn soft" data-suggest>${pi("spark")} ${suggestions.length} Vorschläge hinzufügen</button>` : ""}
        </div>
        <div class="counts">${counts}</div>
        ${
          ids.length
            ? `<div class="stable">
                <div class="shead"><span>Sensor</span><span>Zustand</span><span>${pi("away")}Unterwegs</span><span>${pi("night")}Nacht</span><span>${pi("timer")}Verzögert</span><span></span></div>
                ${rows || `<div class="muted pad">Kein Treffer für „${pesc(this._search)}“</div>`}
              </div>`
            : `<div class="emptybox">${pi("door")}<p>Noch keine Sensoren. Füge oben einen Sensor hinzu oder übernimm die Vorschläge.</p></div>`
        }`
      )}
      ${this._section("Verhalten", "", `<div class="formhost" data-form="sensor_behaviour"></div>`)}`;
  }

  _suggestions() {
    const have = new Set(this._sensorRows());
    return Object.keys(this._hass.states)
      .filter((e) => e.startsWith("binary_sensor.") && !have.has(e))
      .filter((e) => SUGGEST_CLASSES.includes(this._hass.states[e].attributes.device_class));
  }

  _stateChip(eid) {
    const s = this._hass.states[eid];
    if (!s) return '<span class="st off">Nicht gefunden</span>';
    if (s.state === "unavailable" || s.state === "unknown") return '<span class="st off">Nicht erreichbar</span>';
    const txt = STATE_TEXT[s.attributes.device_class] || ["Aus", "An"];
    return s.state === "on" ? `<span class="st on">${txt[1]}</span>` : `<span class="st ok">${txt[0]}</span>`;
  }

  _toggleSensor(key, eid) {
    const list = new Set(this._draft[key] || []);
    if (list.has(eid)) list.delete(eid);
    else list.add(eid);
    this._draft[key] = [...list];
    if (key !== "delayed_sensors" && list.has(eid) === false) {
      // nicht mehr überwacht -> Verzögerung entfernen
      const mon = new Set([...(this._draft.away_sensors || []), ...(this._draft.night_sensors || [])]);
      if (!mon.has(eid)) this._draft.delayed_sensors = (this._draft.delayed_sensors || []).filter((e) => e !== eid);
    }
    if (key === "delayed_sensors" && list.has(eid)) {
      const mon = new Set([...(this._draft.away_sensors || []), ...(this._draft.night_sensors || [])]);
      if (!mon.has(eid)) this._draft.away_sensors = [...(this._draft.away_sensors || []), eid];
    }
    delete this._errors.base;
    this._render();
  }

  _addSensor(eid) {
    if (!eid || this._sensorRows().includes(eid)) return;
    const dc = this._hass.states[eid]?.attributes?.device_class;
    this._draft.away_sensors = [...(this._draft.away_sensors || []), eid];
    if (["door", "window", "opening", "garage_door"].includes(dc)) this._draft.night_sensors = [...(this._draft.night_sensors || []), eid];
    delete this._errors.base;
    this._render();
  }

  _removeSensor(eid) {
    for (const k of ["away_sensors", "night_sensors", "delayed_sensors"]) this._draft[k] = (this._draft[k] || []).filter((e) => e !== eid);
    this._render();
  }

  // ------------------------------------------------------------------ Zeiten
  _delaysHtml() {
    const d = this._draft;
    const seg = (w, cls, label, val) => `<div class="seg ${cls}" style="flex:${Math.max(w, 6)}"><b>${label}</b><span>${val}</span></div>`;
    const tl = (mode, exit, entry) => `
      <div class="tl">
        <div class="tl-h">${pi(mode === "away" ? "away" : "night")} ${mode === "away" ? "Unterwegs" : "Nacht"}</div>
        <div class="tl-bar">
          ${seg(exit, "exit", "Ausgangsverzögerung", exit ? `${exit} s` : "sofort")}
          ${seg(30, "armed", "Scharf", "überwacht")}
          ${seg(entry, "entry", "Eingangsverzögerung", entry ? `${entry} s` : "sofort")}
          ${seg(Math.min(d.trigger_time || 60, 120), "alarm", "Alarm", d.trigger_time ? `${d.trigger_time} s` : "bis Aus")}
        </div>
      </div>`;
    return `
      ${this._section(
        "Ablauf",
        "So läuft die Alarmanlage mit deinen Zeiten ab. Die Grafik passt sich deinen Eingaben sofort an.",
        `${tl("away", d.exit_delay_away, d.entry_delay_away)}${tl("night", d.exit_delay_night, d.entry_delay_night)}`
      )}
      ${this._section("Verzögerungen", "Alle Zeiten in Sekunden.", `<div class="formhost" data-form="delays"></div>`)}`;
  }

  // ---------------------------------------------------------------- Aktionen
  _actionsHtml() {
    const tests = [
      ["notify", "bell", "Benachrichtigung"],
      ["siren", "speaker", "Sirene (3 s)"],
      ["lights", "bulb", "Alarmlicht (5 s)"],
      ["tts", "speaker", "Ansage"],
    ];
    return `
      ${this._section("Bei einem Alarm", "Was soll passieren, wenn Safe Home auslöst?", `<div class="formhost" data-form="actions"></div>`)}
      ${this._section(
        "Testen",
        "Prüfe deine Ausgänge, ohne einen echten Alarm auszulösen. Getestet werden die gespeicherten Einstellungen.",
        `<div class="tests">${tests.map(([k, ic, l]) => `<button class="btn soft" data-test="${k}">${pi(ic)} ${l}</button>`).join("")}</div>`
      )}`;
  }

  // ---------------------------------------------------------------- Automatik
  _automationHtml() {
    const persons = this._draft.persons || [];
    const ppl = persons
      .map((p) => {
        const s = this._hass.states[p];
        const home = s?.state === "home";
        const nm = (s?.attributes?.friendly_name || p).split(" ")[0];
        const pic = s?.attributes?.entity_picture;
        return `<div class="pp ${home ? "home" : ""}"><span class="av">${pic ? `<img src="${pesc(pic)}" alt="">` : pesc(nm[0] || "?")}</span><b>${pesc(nm)}</b><small>${home ? "Zuhause" : s ? pesc(s.state === "not_home" ? "Unterwegs" : s.state) : "?"}</small></div>`;
      })
      .join("");
    return `
      ${this._section(
        "Home-Zone",
        "Safe Home schaltet sich anhand der Home-Zone deiner Personen selbst scharf und unscharf.",
        `${persons.length ? `<div class="people">${ppl}</div>` : ""}<div class="formhost" data-form="presence"></div>`
      )}
      ${this._section("Nachtmodus", "Zeitgesteuert nur die Nachtsensoren überwachen.", `<div class="formhost" data-form="night"></div>`)}`;
  }

  // --------------------------------------------------------------- Sicherheit
  _securityHtml() {
    return this._section("Sicherheit", "Name der Instanz und PIN-Code für die Bedienung über das Dashboard.", `<div class="formhost" data-form="security"></div>`);
  }

  // --------------------------------------------------------------- Protokoll
  _logHtml() {
    const all = this._data.events || [];
    const groups = { all: null, alarm: ["triggered", "pending"], mode: ["armed", "disarmed", "arming"], warn: ["warning", "bypass"] };
    const ev = all.filter((e) => !groups[this._logFilter] || groups[this._logFilter].includes(e.type));
    const tone = { armed: "away", disarmed: "home", triggered: "alarm", pending: "pending", arming: "arming", warning: "pending", bypass: "pending" };
    return this._section(
      "Protokoll",
      "Die letzten 30 Ereignisse dieser Instanz.",
      `<div class="toolbar">
        <div class="seg-ctl">${[["all", "Alle"], ["alarm", "Alarme"], ["mode", "Schaltungen"], ["warn", "Warnungen"]]
          .map(([k, l]) => `<button class="${this._logFilter === k ? "on" : ""}" data-lf="${k}">${l}</button>`)
          .join("")}</div>
        <button class="btn soft" data-reload>${pi("refresh")} Aktualisieren</button>
      </div>
      ${
        ev.length
          ? `<ul class="log">${ev
              .map((e) => `<li><i class="dot t-${tone[e.type] || "info"}"></i><span>${pesc(e.message)}</span><time>${this._fmt(e.time, true)}</time></li>`)
              .join("")}</ul>`
          : `<div class="emptybox">${pi("list")}<p>Keine Einträge.</p></div>`
      }`
    );
  }

  // --------------------------------------------------------------------- Info
  _resourceHtml() {
    const r = this._resource || { state: "pending", message: "Wird abgefragt …", url: "/safe_home_static/safe-home-card.js" };
    const url = r.url || "/safe_home_static/safe-home-card.js";
    const badge = {
      ok: ["#34d399", "Eingetragen"],
      pending: ["#fbbf24", "Wird eingetragen"],
      yaml: ["#fbbf24", "Manuell nötig"],
      error: ["#ef2945", "Fehler"],
    }[r.state] || ["#64748b", r.state];
    const yaml = `lovelace:\n  resources:\n    - url: ${url}\n      type: module`;
    return this._section(
      "Dashboard-Ressource",
      "Damit die Safe-Home-Karten beim Start der App zuverlässig erscheinen, muss die Kartendatei als Ressource eingetragen sein.",
      `<div class="res">
        <span class="pill" style="--tone:${badge[0]}">${pesc(badge[1])}</span>
        <p>${pesc(r.message || "")}</p>
      </div>
      <div class="res-url"><code>${pesc(url)}</code><span class="muted">Typ: JavaScript-Modul</span></div>
      ${r.state === "yaml" ? `<pre class="yaml">${pesc(yaml.replace(/\\n/g, "\n"))}</pre>` : ""}
      <div class="tests">
        ${r.state !== "yaml" ? `<button class="btn primary" data-res="register">${pi("refresh")} Jetzt eintragen</button>` : ""}
        <button class="btn soft" data-res="copy">${pi("list")} Adresse kopieren</button>
        <a class="btn soft" href="/config/lovelace/resources">${pi("ext")} Ressourcen öffnen</a>
      </div>
      ${this._loadStatusHtml()}
      <p class="muted small-note">Manuell: Einstellungen → Dashboards → ⋮ (oben rechts) → Ressourcen → „Ressource hinzufügen“, Adresse oben eintragen, Typ „JavaScript-Modul“. Ist der Menüpunkt nicht sichtbar, im Benutzerprofil den „Erweiterten Modus“ einschalten.</p>`
    );
  }

  _loadStatusHtml() {
    const defined = !!customElements.get("safe-home-card");
    const tone = defined ? "#34d399" : "#ef2945";
    const text = defined
      ? "Kartendatei ist in diesem Browser geladen."
      : "Kartendatei ist in diesem Browser nicht geladen – bitte Seite neu laden. Bleibt das so, die Adresse oben im Browser öffnen und prüfen, ob die Datei erreichbar ist.";
    return `<div class="loadstate"><i style="background:${tone}"></i><span>${pesc(text)}</span></div>`;
  }

  _infoHtml() {
    return `
      ${this._resourceHtml()}
      <section class="box about">
        <img src="${P_LOGO}" alt="" class="biglogo">
        <h2>Safe Home</h2>
        <p class="muted">Version ${pesc(this._data.version || PANEL_VERSION)}</p>
        <p>Die Alarmanlage für Home Assistant – weitestgehend automatisch.</p>
        <div class="links">
          <a class="btn soft" href="https://github.com/digital7even/safe_home" target="_blank" rel="noopener">${pi("ext")} Dokumentation</a>
          <a class="btn soft" href="https://github.com/digital7even/safe_home/issues" target="_blank" rel="noopener">${pi("ext")} Problem melden</a>
          <a class="btn soft" href="/config/integrations/integration/safe_home">${pi("ext")} Integration</a>
          <a class="btn soft" href="/config/integrations/dashboard/add?domain=safe_home">${pi("plus")} Weitere Instanz</a>
        </div>
        <p class="thanks">Mit <span class="heart">❤️</span> entwickelt in Deutschland<br><a href="https://github.com/digital7even" target="_blank" rel="noopener">Digital7even</a></p>
      </section>`;
  }

  // ------------------------------------------------------------- Formulare
  _formSchema(key) {
    const o = this._draft;
    const S = {
      sensor_behaviour: [
        {
          name: "open_sensor_policy",
          selector: {
            select: {
              mode: "list",
              options: [
                { value: "bypass", label: "Überbrücken und melden – wird überwacht, sobald er geschlossen ist" },
                { value: "block", label: "Scharfschalten verhindern und melden" },
              ],
            },
          },
        },
        { name: "tamper_notify", selector: bool },
      ],
      delays: [
        { type: "grid", name: "", schema: [{ name: "exit_delay_away", selector: sec() }, { name: "entry_delay_away", selector: sec() }] },
        { type: "grid", name: "", schema: [{ name: "exit_delay_night", selector: sec() }, { name: "entry_delay_night", selector: sec() }] },
        { name: "trigger_time", selector: sec(7200) },
        { name: "rearm_after_trigger", selector: bool },
      ],
      actions: [
        { name: "sirens", selector: ents(["siren", "switch", "input_boolean", "script"]) },
        { name: "alarm_lights", selector: ents("light") },
        {
          name: "notify_services",
          selector: {
            select: {
              multiple: true,
              custom_value: true,
              mode: "dropdown",
              options: [...new Set([...(this._data.notify_services || []), ...(o.notify_services || [])])].map((s) => ({ value: s, label: s })),
            },
          },
        },
        { name: "notify_state_changes", selector: bool },
        { name: "critical_notifications", selector: bool },
        { name: "notification_disarm_action", selector: bool },
        { name: "cameras", selector: ents("camera") },
        { type: "grid", name: "", schema: [{ name: "tts_entity", selector: ents("tts", false) }, { name: "media_players", selector: ents("media_player") }] },
      ],
      presence: [
        { name: "persons", selector: ents(["person", "device_tracker"]) },
        { name: "auto_arm", selector: bool },
        { name: "auto_arm_delay", selector: sec() },
        { name: "auto_disarm", selector: bool },
      ],
      night: [
        { name: "night_auto", selector: bool },
        { type: "grid", name: "", schema: [{ name: "night_start", selector: { time: {} } }, { name: "night_end", selector: { time: {} } }] },
        { name: "night_only_when_home", selector: bool },
      ],
      security: [
        { name: "name", selector: { text: {} } },
        { name: "code", selector: { text: { type: "password" } } },
        { name: "code_arm_required", selector: bool },
        { name: "notify_wrong_code", selector: bool },
      ],
    };
    return S[key];
  }

  _mountForms() {
    this.shadowRoot.querySelectorAll(".formhost").forEach((host) => {
      const key = host.dataset.form;
      const schema = this._formSchema(key);
      const data = { ...this._draft, name: this._title };
      if (this._hasForm) {
        const f = document.createElement("ha-form");
        f.hass = this._hass;
        f.data = data;
        f.schema = schema;
        f.computeLabel = (s) => LABELS[s.name] || s.name;
        f.computeHelper = (s) => HELPERS[s.name];
        f.computeError = (err, s) => this._errors[s?.name] || err;
        const errs = {};
        for (const k of Object.keys(this._errors)) errs[k] = this._errors[k];
        f.error = errs;
        f.addEventListener("value-changed", (ev) => {
          const v = ev.detail.value;
          for (const name of flatNames(schema)) {
            const nv = v[name];
            const ov = name === "name" ? this._title : this._draft[name];
            if (JSON.stringify(nv ?? null) !== JSON.stringify(ov ?? null)) this._set(name, nv ?? (Array.isArray(ov) ? [] : nv));
          }
          f.data = { ...this._draft, name: this._title };
          if (key === "delays") this._refreshTimeline();
        });
        host.appendChild(f);
        this._forms.push(f);
      } else {
        host.innerHTML = fallbackForm(schema, data, this._errors);
        host.querySelectorAll("[data-f]").forEach((inp) =>
          inp.addEventListener("change", () => {
            this._set(inp.dataset.f, readFallback(inp, this._draft[inp.dataset.f]));
            if (key === "delays") this._refreshTimeline();
          })
        );
      }
    });
  }

  _refreshTimeline() {
    const box = this.shadowRoot.querySelector(".content[data-tab='delays'] .box");
    if (!box) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = this._delaysHtml();
    box.replaceWith(tmp.querySelector(".box"));
  }

  _bindTab(tab) {
    const root = this.shadowRoot;
    this._forms = [];
    this._mountForms();
    root.querySelectorAll("[data-go]").forEach((b) =>
      b.addEventListener("click", () => {
        this._tab = b.dataset.go;
        this._store("safe_home_panel_tab", this._tab);
        this._render();
      })
    );
    if (tab === "overview") {
      const host = root.querySelector(".cardhost");
      const make = () => {
        const c = document.createElement("safe-home-tablet-card");
        c.setConfig({ entity: this._data.entity_id, show_events: false });
        c.hass = this._hass;
        host.appendChild(c);
        this._card = c;
      };
      if (customElements.get("safe-home-tablet-card")) make();
      else customElements.whenDefined("safe-home-tablet-card").then(() => host.isConnected && make());
    } else this._card = null;
    if (tab === "sensors") {
      root.querySelectorAll("[data-sw]").forEach((b) => b.addEventListener("click", () => this._toggleSensor(b.dataset.sw, b.dataset.eid)));
      root.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => this._removeSensor(b.dataset.del)));
      const search = root.querySelector(".search input");
      search?.addEventListener("input", () => {
        this._search = search.value;
        const pos = search.selectionStart;
        this._render();
        const s2 = this.shadowRoot.querySelector(".search input");
        s2?.focus();
        s2?.setSelectionRange(pos, pos);
      });
      root.querySelector("[data-suggest]")?.addEventListener("click", () => {
        for (const e of this._suggestions()) {
          const dc = this._hass.states[e].attributes.device_class;
          this._draft.away_sensors = [...(this._draft.away_sensors || []), e];
          if (["door", "window", "opening", "garage_door"].includes(dc)) this._draft.night_sensors = [...(this._draft.night_sensors || []), e];
          if (dc === "door" && /haust|front|eingang|entry/i.test(e + this._name(e))) this._draft.delayed_sensors = [...(this._draft.delayed_sensors || []), e];
        }
        delete this._errors.base;
        this._render();
      });
      const addhost = root.querySelector(".addhost");
      if (this._hasForm) {
        const f = document.createElement("ha-form");
        f.hass = this._hass;
        f.data = {};
        f.schema = [{ name: "add", selector: { entity: { domain: "binary_sensor" } } }];
        f.computeLabel = () => "Sensor hinzufügen";
        f.addEventListener("value-changed", (ev) => ev.detail.value.add && this._addSensor(ev.detail.value.add));
        addhost.appendChild(f);
      } else {
        addhost.innerHTML = `<input class="fb" list="sh-bs" placeholder="binary_sensor.… hinzufügen"><datalist id="sh-bs">${Object.keys(this._hass.states)
          .filter((e) => e.startsWith("binary_sensor."))
          .map((e) => `<option value="${pesc(e)}">`)
          .join("")}</datalist>`;
        addhost.querySelector("input").addEventListener("change", (e) => this._addSensor(e.target.value.trim()));
      }
    }
    if (tab === "info") {
      root.querySelector('[data-res="register"]')?.addEventListener("click", async (e) => {
        e.currentTarget.disabled = true;
        await this._loadResource(true);
        this._showToast(this._resource.state === "ok" ? "Ressource eingetragen" : this._resource.message, this._resource.state === "ok" ? "ok" : "err");
        this._render();
      });
      root.querySelector('[data-res="copy"]')?.addEventListener("click", async () => {
        const url = this._resource?.url || "/safe_home_static/safe-home-card.js";
        try {
          await navigator.clipboard.writeText(url);
          this._showToast("Adresse kopiert", "ok");
        } catch (err) {
          this._showToast(url, "ok");
        }
      });
    }
    if (tab === "actions") root.querySelectorAll("[data-test]").forEach((b) => b.addEventListener("click", () => this._test(b.dataset.test)));
    if (tab === "log") {
      root.querySelectorAll("[data-lf]").forEach((b) =>
        b.addEventListener("click", () => {
          this._logFilter = b.dataset.lf;
          this._render();
        })
      );
      root.querySelector("[data-reload]")?.addEventListener("click", async () => {
        const d = await this._ws({ type: "safe_home/config", entry_id: this._entryId });
        this._data.events = d.events;
        this._render();
      });
    }
  }

  _updateLive() {
    if (!this._data) return;
    for (const f of this._forms) f.hass = this._hass;
    if (this._card) this._card.hass = this._hass;
    this.shadowRoot.querySelectorAll("[data-live]").forEach((el) => {
      const html = this._stateChip(el.dataset.live);
      if (el.innerHTML !== html) el.innerHTML = html;
    });
    const st = this._hass.states[this._data.entity_id];
    const pill = this.shadowRoot.querySelector(".top .pill");
    if (pill && st) {
      const info = STATE_PILL[st.state] || STATE_PILL.unknown;
      if (pill.textContent !== info.l) {
        pill.textContent = info.l;
        pill.style.setProperty("--tone", info.c);
      }
    }
  }

  _name(eid) {
    return this._hass.states[eid]?.attributes?.friendly_name || eid;
  }
  _area(eid) {
    const h = this._hass;
    const ent = h.entities?.[eid];
    const id = ent?.area_id || (ent?.device_id ? h.devices?.[ent.device_id]?.area_id : null);
    return id ? h.areas?.[id]?.name : null;
  }
  _fmt(iso, full = false) {
    if (!iso) return "";
    const d = new Date(iso);
    const t = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", ...(full ? { second: "2-digit" } : {}) });
    if (d.toDateString() === new Date().toDateString()) return full ? `Heute ${t}` : t;
    return `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", ...(full ? { year: "numeric" } : {}) })} ${t}`;
  }
}

const STATE_PILL = {
  disarmed: { l: "Zuhause", c: "#34d399" },
  armed_away: { l: "Unterwegs", c: "#4f8dff" },
  armed_night: { l: "Nacht", c: "#a78bfa" },
  arming: { l: "Wird scharf", c: "#3b7bff" },
  pending: { l: "Eingangsverzögerung", c: "#fbbf24" },
  triggered: { l: "ALARM", c: "#ef2945" },
  unknown: { l: "Nicht verfügbar", c: "#64748b" },
};

function flatNames(schema) {
  const out = [];
  for (const s of schema) {
    if (s.schema) out.push(...flatNames(s.schema));
    else if (s.name) out.push(s.name);
  }
  return out;
}

async function ensureHaForm() {
  if (customElements.get("ha-form")) return true;
  try {
    const helpers = await window.loadCardHelpers?.();
    if (helpers) {
      for (const cfg of [{ type: "button", entity: "sun.sun" }, { type: "entities", entities: [] }]) {
        const card = await helpers.createCardElement(cfg);
        await card?.constructor?.getConfigElement?.();
        if (customElements.get("ha-form")) break;
      }
    }
  } catch (e) {
    /* Fallback unten */
  }
  try {
    await Promise.race([customElements.whenDefined("ha-form"), new Promise((_, rej) => setTimeout(rej, 4000))]);
    return true;
  } catch (e) {
    return false;
  }
}

// Einfache Eingabefelder, falls ha-form nicht verfügbar ist
function fallbackForm(schema, data, errors) {
  return flatSchema(schema)
    .map((s) => {
      const label = pesc(LABELS[s.name] || s.name);
      const v = data[s.name];
      const sel = s.selector || {};
      const err = errors[s.name] ? `<em class="fb-err">${pesc(errors[s.name])}</em>` : "";
      let input;
      if (sel.boolean) input = `<input type="checkbox" data-f="${s.name}" ${v ? "checked" : ""}>`;
      else if (sel.number) input = `<input class="fb" type="number" min="${sel.number.min}" max="${sel.number.max}" data-f="${s.name}" value="${pesc(v)}">`;
      else if (sel.time) input = `<input class="fb" type="time" step="1" data-f="${s.name}" value="${pesc(v)}">`;
      else if (sel.select && !sel.select.multiple)
        input = `<select class="fb" data-f="${s.name}">${sel.select.options.map((o) => `<option value="${pesc(o.value)}" ${o.value === v ? "selected" : ""}>${pesc(o.label)}</option>`).join("")}</select>`;
      else if (sel.entity || (sel.select && sel.select.multiple))
        input = `<input class="fb" data-f="${s.name}" data-list="${Array.isArray(v) || sel.select ? 1 : ""}" value="${pesc(Array.isArray(v) ? v.join(", ") : v || "")}" placeholder="Entitäten, durch Komma getrennt">`;
      else input = `<input class="fb" type="${sel.text?.type === "password" ? "password" : "text"}" data-f="${s.name}" value="${pesc(v)}">`;
      return `<label class="fb-row ${sel.boolean ? "inline" : ""}"><span>${label}</span>${input}${err}</label>`;
    })
    .join("");
}
function flatSchema(schema) {
  const out = [];
  for (const s of schema) s.schema ? out.push(...flatSchema(s.schema)) : out.push(s);
  return out;
}
function readFallback(inp, old) {
  if (inp.type === "checkbox") return inp.checked;
  if (inp.type === "number") return Number(inp.value);
  if (inp.dataset.list || Array.isArray(old))
    return inp.value.split(",").map((x) => x.trim()).filter(Boolean);
  return inp.value;
}

const PANEL_STYLE = `
:host{
  --sh-bg1:#071538; --sh-bg2:#0b2463; --sh-surface:rgba(255,255,255,.05); --sh-surface2:rgba(255,255,255,.09);
  --sh-line:rgba(160,190,255,.16); --sh-text:#eef3ff; --sh-muted:#9fb1d9; --sh-accent:#3b7bff;
  --sh-home:#34d399; --sh-away:#4f8dff; --sh-night:#a78bfa; --sh-pending:#fbbf24; --sh-alarm:#ef2945;
  /* Home-Assistant-Formulare an das dunkle Design anpassen */
  --primary-color:#3b7bff; --accent-color:#3b7bff; --primary-text-color:#eef3ff; --secondary-text-color:#9fb1d9;
  --text-primary-color:#fff; --disabled-text-color:#64748b; --divider-color:rgba(160,190,255,.16);
  --card-background-color:#0f2560; --secondary-background-color:#0b1d4d; --primary-background-color:#071538;
  --input-fill-color:rgba(255,255,255,.06); --input-disabled-fill-color:rgba(255,255,255,.03); --input-ink-color:#eef3ff;
  --input-label-ink-color:#9fb1d9; --input-idle-line-color:rgba(160,190,255,.3); --input-hover-line-color:#9fb1d9;
  --input-dropdown-icon-color:#9fb1d9; --mdc-theme-primary:#3b7bff; --mdc-theme-surface:#0f2560; --mdc-theme-text-primary-on-background:#eef3ff;
  --mdc-text-field-fill-color:rgba(255,255,255,.06); --mdc-text-field-ink-color:#eef3ff; --mdc-text-field-label-ink-color:#9fb1d9;
  --mdc-select-fill-color:rgba(255,255,255,.06); --mdc-select-ink-color:#eef3ff; --mdc-select-label-ink-color:#9fb1d9;
  --mdc-checkbox-unchecked-color:#9fb1d9; --switch-checked-color:#3b7bff; --switch-unchecked-button-color:#cbd5e1; --switch-unchecked-track-color:#475569;
  --ha-card-background:#0f2560; --sidebar-selected-icon-color:#3b7bff;
  display:block; height:100%; color:var(--sh-text); font-family:var(--ha-font-family-body, "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
}
*{box-sizing:border-box}
.app{position:relative; min-height:100vh; min-height:100dvh; overflow:hidden;
  background:radial-gradient(90% 60% at 100% 0%, #123a9a 0%, transparent 60%), linear-gradient(160deg,var(--sh-bg2),var(--sh-bg1) 65%)}
.glow{position:absolute; top:-260px; right:-200px; width:640px; height:640px; background:radial-gradient(closest-side, rgba(59,123,255,.25), transparent); pointer-events:none}
.ic{width:20px; height:20px; flex:none}
.top{position:sticky; top:0; z-index:5; display:flex; align-items:center; gap:14px; padding:14px 24px; background:rgba(7,21,56,.72); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid var(--sh-line)}
.logo{width:40px; height:40px; object-fit:contain; filter:drop-shadow(0 3px 8px rgba(0,0,0,.45))}
.ttl{flex:1; min-width:0}
.ttl h1{margin:0; font-size:1.25rem; font-weight:800; letter-spacing:.2px}
.ttl span{font-size:.8rem; color:var(--sh-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block}
.pill{font-size:.78rem; font-weight:700; padding:6px 12px; border-radius:999px; color:var(--tone); background:color-mix(in srgb,var(--tone) 16%, transparent); border:1px solid color-mix(in srgb,var(--tone) 45%, transparent); white-space:nowrap}
.inst{appearance:none; background:var(--sh-surface); color:var(--sh-text); border:1px solid var(--sh-line); border-radius:10px; padding:8px 12px; font:inherit; font-size:.85rem}
.iconbtn{all:unset; cursor:pointer; display:grid; place-items:center; width:38px; height:38px; border-radius:10px; color:var(--sh-muted)}
.iconbtn:hover{background:var(--sh-surface2); color:var(--sh-text)}
.body{position:relative; display:grid; grid-template-columns:230px minmax(0,1fr); gap:24px; max-width:1240px; margin:0 auto; padding:24px 24px 120px}
.tabs{position:sticky; top:92px; align-self:start; display:flex; flex-direction:column; gap:4px}
.tab{all:unset; box-sizing:border-box; cursor:pointer; position:relative; display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:12px; color:var(--sh-muted); font-size:.92rem; font-weight:600}
.tab:hover{background:var(--sh-surface); color:var(--sh-text)}
.tab.active{background:linear-gradient(150deg,#3b7bff,#1d3fb8); color:#fff; box-shadow:0 6px 18px rgba(59,123,255,.35)}
.dot-err{position:absolute; right:12px; width:8px; height:8px; border-radius:50%; background:var(--sh-alarm)}
.body.narrow{grid-template-columns:minmax(0,1fr); padding:0 12px 120px; gap:12px}
.narrow .tabs{position:sticky; top:0; z-index:4; flex-direction:row; overflow-x:auto; gap:6px; padding:6px; margin:0 -12px; background:rgba(7,21,56,.8); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); scrollbar-width:none}
.narrow .tabs::-webkit-scrollbar{display:none}
.narrow .tab{flex:none; padding:9px 12px; font-size:.84rem}
.narrow .top{padding:10px 12px}
.app.is-narrow .top{position:relative}
.content{display:flex; flex-direction:column; gap:18px; min-width:0}
.box{background:rgba(255,255,255,.04); border:1px solid var(--sh-line); border-radius:20px; padding:20px}
.box-h{margin-bottom:16px}
.box-h h2{margin:0; font-size:1.05rem; font-weight:700}
.box-h p{margin:6px 0 0; font-size:.86rem; color:var(--sh-muted); line-height:1.5}
.muted{color:var(--sh-muted)} .pad{padding:16px}
.btn{all:unset; box-sizing:border-box; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:12px; font-size:.88rem; font-weight:700; white-space:nowrap}
.btn .ic{width:18px; height:18px}
.btn.primary{background:var(--sh-accent); color:#fff; box-shadow:0 6px 16px rgba(59,123,255,.35)}
.btn.primary[disabled]{opacity:.6; cursor:wait}
.btn.ghost{color:var(--sh-text); border:1px solid var(--sh-line)}
.btn.soft{background:rgba(59,123,255,.14); border:1px solid rgba(59,123,255,.4); color:#dbe7ff}
.btn.soft:hover{background:rgba(59,123,255,.25)}
.tiles{display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px}
.tile{all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; gap:6px; padding:16px; border-radius:18px; background:rgba(255,255,255,.05); border:1px solid var(--sh-line)}
.tile .ic{color:#9cc0ff; width:22px; height:22px}
.tile b{font-size:1.8rem; font-weight:800; line-height:1.1} .tile b.sm{font-size:1.1rem; padding:8px 0 4px}
.tile span{font-size:.8rem; color:var(--sh-muted)}
.tile.warn{border-color:rgba(251,191,36,.45); background:rgba(251,191,36,.08)} .tile.warn .ic{color:var(--sh-pending)}
.hints{display:flex; flex-direction:column; gap:8px}
.hint{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; background:rgba(251,191,36,.08); border:1px solid rgba(251,191,36,.3); font-size:.88rem; color:#fde68a}
.hint span{flex:1} .hint .go{opacity:.6; width:16px; height:16px}
.allgood{display:flex; align-items:center; gap:10px; color:#a7f3d0} .allgood .ic{color:var(--sh-home)}
.toolbar{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:12px}
.search{display:flex; align-items:center; gap:8px; padding:0 12px; height:44px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-muted); min-width:200px; flex:1}
.search input{all:unset; flex:1; color:var(--sh-text); font-size:.9rem}
.addhost{flex:1; min-width:240px}
.counts{display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px}
.chip{font-size:.75rem; font-weight:600; padding:5px 10px; border-radius:999px; background:var(--sh-surface2); color:#c7d6ff}
.stable{border:1px solid var(--sh-line); border-radius:16px; overflow:hidden}
.shead,.srow{display:grid; grid-template-columns:minmax(0,2.4fr) minmax(110px,1fr) 96px 96px 96px 48px; align-items:center; gap:8px; padding:10px 14px}
.shead{font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--sh-muted); background:rgba(255,255,255,.03)}
.shead span{display:flex; align-items:center; gap:6px; justify-content:center} .shead span:first-child,.shead span:nth-child(2){justify-content:flex-start}
.shead .ic{width:15px; height:15px}
.srow{border-top:1px solid var(--sh-line)}
.srow:hover{background:rgba(255,255,255,.025)}
.s-name{display:flex; align-items:center; gap:12px; min-width:0}
.s-name > .ic{color:#9cc0ff}
.s-name div{display:flex; flex-direction:column; min-width:0}
.s-name b{font-size:.9rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.s-name small{font-size:.72rem; color:var(--sh-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.s-sw,.s-del{display:flex; justify-content:center}
.st{font-size:.74rem; font-weight:700; padding:4px 9px; border-radius:8px}
.st.ok{color:#6ee7b7; background:rgba(52,211,153,.12)} .st.on{color:#fde68a; background:rgba(251,191,36,.15)} .st.off{color:#94a3b8; background:rgba(148,163,184,.12)}
.sw{all:unset; cursor:pointer; position:relative; width:44px; height:26px; border-radius:99px; background:rgba(255,255,255,.14); transition:background .2s}
.sw i{position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#cbd5e1; transition:transform .2s}
.sw.on{background:var(--sh-accent)} .sw.on i{transform:translateX(18px); background:#fff}
.sw:focus-visible{outline:2px solid #9cc0ff; outline-offset:2px}
.emptybox{display:flex; flex-direction:column; align-items:center; gap:8px; padding:30px; text-align:center; color:var(--sh-muted)}
.emptybox .ic{width:34px; height:34px}
.tl{margin-bottom:14px}
.tl-h{display:flex; align-items:center; gap:8px; font-size:.85rem; font-weight:700; margin-bottom:8px}
.tl-bar{display:flex; gap:4px; border-radius:12px; overflow:hidden}
.seg{display:flex; flex-direction:column; gap:2px; padding:10px 12px; min-width:0}
.seg b{font-size:.72rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis} .seg span{font-size:.8rem; font-weight:700}
.seg.exit{background:rgba(59,123,255,.25)} .seg.armed{background:rgba(79,141,255,.12)} .seg.entry{background:rgba(251,191,36,.2)} .seg.alarm{background:rgba(239,41,69,.25)}
.tests{display:flex; flex-wrap:wrap; gap:10px}
.people{display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px}
.pp{display:flex; flex-direction:column; align-items:center; gap:3px; width:84px}
.pp .av{width:54px; height:54px; border-radius:50%; display:grid; place-items:center; font-weight:800; font-size:1.2rem; background:linear-gradient(150deg,#2a4a9a,#16306e); border:3px solid rgba(255,255,255,.14); overflow:hidden}
.pp .av img{width:100%; height:100%; object-fit:cover}
.pp.home .av{border-color:var(--sh-home)} .pp:not(.home) .av{filter:grayscale(.9); opacity:.6}
.pp b{font-size:.85rem} .pp small{font-size:.72rem; color:var(--sh-muted)} .pp.home small{color:#6ee7b7}
.seg-ctl{display:flex; gap:4px; padding:4px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); flex-wrap:wrap}
.seg-ctl button{all:unset; cursor:pointer; padding:7px 12px; border-radius:9px; font-size:.82rem; font-weight:600; color:var(--sh-muted)}
.seg-ctl button.on{background:var(--sh-accent); color:#fff}
.log{list-style:none; margin:0; padding:0}
.log li{display:flex; align-items:center; gap:12px; padding:11px 4px; border-top:1px solid var(--sh-line); font-size:.88rem}
.log li:first-child{border-top:none}
.log span{flex:1; min-width:0}
.log time{color:var(--sh-muted); font-size:.78rem; font-variant-numeric:tabular-nums; white-space:nowrap}
.dot{width:9px; height:9px; border-radius:50%; flex:none; background:#7c8db5}
.t-home{background:var(--sh-home)} .t-away{background:var(--sh-away)} .t-alarm{background:var(--sh-alarm); box-shadow:0 0 8px var(--sh-alarm)} .t-pending{background:var(--sh-pending)} .t-arming{background:var(--sh-accent)}
.res{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px}
.res p{margin:0; font-size:.88rem; flex:1; min-width:220px}
.res-url{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px}
.res-url code, .yaml{font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.84rem; background:rgba(0,0,0,.3); border:1px solid var(--sh-line); border-radius:8px; padding:6px 10px; color:#dbe7ff}
.yaml{display:block; white-space:pre; padding:12px; margin:0 0 14px; overflow-x:auto}
.loadstate{display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,.2); font-size:.85rem}
.loadstate i{width:10px; height:10px; border-radius:50%; flex:none; margin-top:4px}
.small-note{font-size:.8rem; margin:14px 0 0; line-height:1.5}
.about{display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:36px 20px}
.about h2{margin:6px 0 0; font-size:1.6rem}
.about p{margin:4px 0}
.biglogo{width:96px; height:96px; object-fit:contain; filter:drop-shadow(0 8px 20px rgba(0,0,0,.45))}
.links{display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin:16px 0}
.thanks{margin-top:14px !important; font-size:.92rem; color:var(--sh-muted); line-height:1.7}
.thanks a{color:#9cc0ff; font-weight:700; text-decoration:none}
.heart{display:inline-block; animation:beat 1.6s ease-in-out infinite}
@keyframes beat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}}
.banner{display:flex; gap:12px; padding:14px 16px; border-radius:14px; font-size:.88rem}
.banner.err{background:rgba(239,41,69,.12); border:1px solid rgba(239,41,69,.45); color:#fecdd3}
.banner ul{margin:6px 0 0; padding-left:18px}
.savebar{position:fixed; left:50%; bottom:20px; z-index:10; transform:translate(-50%, calc(100% + 60px)); visibility:hidden; display:flex; align-items:center; gap:10px; padding:10px 10px 10px 18px; border-radius:16px; background:rgba(11,29,77,.95); border:1px solid rgba(59,123,255,.5); box-shadow:0 18px 40px rgba(0,0,0,.5); backdrop-filter:blur(10px); transition:transform .25s ease, visibility .25s; max-width:calc(100% - 24px)}
.savebar.show{transform:translate(-50%,0); visibility:visible}
.savebar > span{display:flex; align-items:center; gap:8px; font-size:.88rem; font-weight:600; color:#fde68a; margin-right:6px; white-space:nowrap}
.toast-host{position:fixed; top:80px; right:20px; z-index:11}
.toast{display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; font-size:.88rem; font-weight:600; box-shadow:0 12px 30px rgba(0,0,0,.45); animation:tin .25s ease}
.toast.ok{background:#047857; color:#fff} .toast.err{background:#be123c; color:#fff}
@keyframes tin{from{opacity:0; transform:translateY(-8px)}}
.center{display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:10px; min-height:60vh; padding:24px; position:relative}
.center.err .ic{width:36px; height:36px; color:var(--sh-alarm)}
.empty h2{margin:10px 0 0} .empty p{color:var(--sh-muted); max-width:420px}
.spinner{width:36px; height:36px; border-radius:50%; border:3px solid rgba(255,255,255,.15); border-top-color:var(--sh-accent); animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.fb-row{display:flex; flex-direction:column; gap:6px; margin-bottom:14px; font-size:.86rem; color:var(--sh-muted)}
.fb-row.inline{flex-direction:row-reverse; justify-content:flex-end; align-items:center; gap:10px}
.fb{width:100%; padding:11px 12px; border-radius:10px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-text); font:inherit}
.fb-err{color:#fda4af; font-style:normal; font-size:.78rem}
@media (max-width:860px){
  .shead{display:none}
  .srow{grid-template-columns:minmax(0,1fr) auto; row-gap:8px}
  .s-name{grid-column:1} .s-state{grid-column:2; grid-row:1; justify-self:end}
  .srow .s-sw{grid-column:1 / -1; display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px dashed var(--sh-line)}
  .srow .s-sw::before{font-size:.84rem; color:var(--sh-muted)}
  .srow .s-sw:nth-of-type(3)::before{content:"Unterwegs"}
  .srow .s-sw:nth-of-type(4)::before{content:"Nacht"}
  .srow .s-sw:nth-of-type(5)::before{content:"Eingangsverzögerung"}
  .s-del{grid-column:1 / -1; justify-content:flex-end}
  .savebar > span{display:none}
}
`;

if (!customElements.get("safe-home-panel")) customElements.define("safe-home-panel", SafeHomePanel);
