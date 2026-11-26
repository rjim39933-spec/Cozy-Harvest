// IrrigationSystem - Pumps, tanks, pipes

export const PUMP_SPECS = {
  creek_5: { t: 'creek', kw: 5.5, lps: 8, hm: 45, eff: 0.72, ft: 'elec', fc: 5.5, $: 2400, mi: 2000 },
  creek_11: { t: 'creek', kw: 11, lps: 15, hm: 60, eff: 0.75, ft: 'elec', fc: 11, $: 4800, mi: 2000 },
  bore_7: { t: 'bore', kw: 7.5, lps: 5, hm: 120, eff: 0.68, ft: 'elec', fc: 7.5, $: 6500, mi: 3000 },
  diesel_15: { t: 'diesel', kw: 15, lps: 20, hm: 50, eff: 0.65, ft: 'diesel', fc: 3.5, $: 8500, mi: 1500 },
  boost_3: { t: 'boost', kw: 3, lps: 12, hm: 30, eff: 0.8, ft: 'elec', fc: 3, $: 1200, mi: 5000 }
};
export const TANK_SPECS = {
  rw_22k: { t: 'rain', cap: 22500, mat: 'steel', grav: true, $: 3200, fp: { w: 4, h: 4 } },
  rw_50k: { t: 'rain', cap: 50000, mat: 'steel', grav: true, $: 6800, fp: { w: 6, h: 6 } },
  dam_15m: { t: 'dam', cap: 15000000, mat: 'earth', grav: false, $: 8500, fp: { w: 20, h: 15 } },
  dam_50m: { t: 'dam', cap: 50000000, mat: 'earth', grav: false, $: 22000, fp: { w: 35, h: 25 } },
  trough: { t: 'trough', cap: 2000, mat: 'conc', grav: true, $: 450, fp: { w: 2, h: 1 } },
  header: { t: 'header', cap: 5000, mat: 'poly', grav: true, $: 1800, fp: { w: 3, h: 3 } }
};

export class IrrigationManager {
  constructor() { this.pumps = new Map(); this.tanks = new Map(); this.pipes = new Map(); this.zones = new Map(); this.src = new Map(); this.pres = 0; this.flow = 0; this.ekw = 0; this.dl = 0; this.wu = 0; this.initSrc(); }
  initSrc() { this.src.set('creek', { id: 'creek', t: 'creek', pos: { x: 0, y: 0 }, ml: 50, lvl: 100, q: 'good', sv: 0.3 }); this.src.set('bore', { id: 'bore', t: 'bore', pos: { x: 0, y: 0 }, ml: 10, lvl: 80, q: 'exc', sv: 0.1 }); this.src.set('rain', { id: 'rain', t: 'tank', pos: { x: 0, y: 0 }, ml: 100, lvl: 0, q: 'good', sv: 0 }); this.src.set('muni', { id: 'muni', t: 'muni', pos: { x: 0, y: 0 }, ml: 200, lvl: 100, q: 'treat', sv: 0, ck: 2.1 }); }
  install(pump, pos, sid, diy) { const s = PUMP_SPECS[pump]; if (!s) return { ok: false, p: null, m: 'bad pump' }; const src = this.src.get(sid); if (!src) return { ok: false, p: null, m: 'no source' }; let e = s.eff; if (diy) e *= 0.85; const p = { id: 'pmp_' + Date.now(), s: { ...s, eff: e }, pos, sid, run: false, hr: 0, lm: 0, cond: 100, fl: 0, pr: 0, eu: 0, du: 0 }; this.pumps.set(p.id, p); return { ok: true, p, m: `Installed ${s.t} ${s.kw}kW` }; }
  tank(type, pos, pipes) { const s = TANK_SPECS[type]; if (!s) return { ok: false, t: null }; const t = { id: 'tnk_' + Date.now(), s, pos, lvl: 0, pipes: pipes || [], in: null, out: null, ov: null, lr: 0 }; this.tanks.set(t.id, t); return { ok: true, t }; }
  pipe(f, t, d = 50, m = 'galv') { const l = Math.hypot(t.x - f.x, t.y - f.y) / 16; const p = { id: 'pip_' + Date.now(), f, t, d, m, l, fl: 0, pr: 0, cond: 100, lk: false, ls: 0 }; this.pipes.set(p.id, p); return p; }
  zone(n, vp, sp, a) { const fr = a * 5, pr = 300 + a * 10; const z = { id: 'zn_' + Date.now(), n, vp, sp, a, fr, pr, sc: [], en: true, lr: 0, tgt: 70 }; this.zones.set(z.id, z); return z; }
  start(id) { const p = this.pumps.get(id); if (!p || p.run) return false; const s = this.src.get(p.sid); if (!s || s.lvl <= 0) return false; p.run = true; p.fl = p.s.lps * p.s.eff; p.pr = p.s.hm * 9.81; return true; }
  stop(id) { const p = this.pumps.get(id); if (!p || !p.run) return false; p.run = false; p.fl = 0; p.pr = 0; return true; }
  run(id, mins) { const z = this.zones.get(id); if (!z || !z.en) return { ok: false, w: 0, m: 'zone off' }; const ps = Array.from(this.pumps.values()).filter(p => p.run); const tf = ps.reduce((s, p) => s + p.fl, 0), tp = ps.length ? Math.max(...ps.map(p => p.pr)) : 0; if (tf < z.fr) return { ok: false, w: 0, m: `flow ${tf.toFixed(1)} < ${z.fr}` }; if (tp < z.pr) return { ok: false, w: 0, m: `pres ${tp.toFixed(0)} < ${z.pr}` }; const wu = z.fr * mins * 60 / 1000; for (const p of ps) { const sh = p.fl / tf; p.hr += mins / 60; p.cond = Math.max(0, p.cond - mins / 60 * 0.05); if (p.s.ft === 'elec') { p.eu += p.s.fc * sh * mins / 60; this.ekw += p.s.fc * sh * mins / 60; } else { p.du += p.s.fc * sh * mins / 60; this.dl += p.s.fc * sh * mins / 60; } } const s = this.src.get(ps[0]?.sid); if (s) s.lvl = Math.max(0, s.lvl - wu / 1000 * 100); const rs = this.src.get('rain'); if (rs) { const tc = Array.from(this.tanks.values()).filter(t => t.s.t === 'rain').reduce((s, t) => s + t.s.cap, 0), cl = Array.from(this.tanks.values()).filter(t => t.s.t === 'rain').reduce((s, t) => s + t.lvl, 0); rs.lvl = tc > 0 ? cl / tc * 100 : 0; } this.wu += wu; z.lr = Date.now(); return { ok: true, w: wu, m: `Irrigated ${z.n} ${mins}m (${wu.toFixed(2)} kL)` }; }
  rain(mm, area = 10000) { const eff = 0.85, L = mm * area * eff; let rem = L; for (const t of this.tanks.values()) if (t.s.t === 'rain') { const sp = t.s.cap - t.lvl, got = Math.min(sp, rem * (t.s.cap / 100000)); t.lvl += got; rem -= got; } const rs = this.src.get('rain'); if (rs) { const tc = Array.from(this.tanks.values()).filter(t => t.s.t === 'rain').reduce((s, t) => s + t.s.cap, 0), cl = Array.from(this.tanks.values()).filter(t => t.s.t === 'rain').reduce((s, t) => s + t.lvl, 0); rs.lvl = tc > 0 ? cl / tc * 100 : 0; } return L; }
  leak() { const l = []; for (const p of this.pipes.values()) { const c = (100 - p.cond) / 10000 * (p.pr / 100); if (Math.random() < c && !p.lk) { p.lk = true; p.ls = Math.random() * 0.4 + 0.1; l.push(p); } if (p.lk) { p.ls = Math.min(1, p.ls + 0.001); p.cond = Math.max(0, p.cond - 0.01); } } return l; }
  fix(id, q) { const p = this.pipes.get(id); if (!p) return { ok: false, m: 'no pipe' }; const rv = { perfect: 30, good: 15, poor: 5 }[q]; p.cond = Math.min(100, p.cond + rv); if (p.cond > 80) { p.lk = false; p.ls = 0; } return { ok: true, m: `Fixed (${q}). Cond: ${Math.round(p.cond)}%` }; }
  repl(id) { const p = this.pipes.get(id); if (!p) return { ok: false, $: 0 }; const $ = Math.round(p.l * { galv: 25, poly: 15, pvc: 12 }[p.m]); p.cond = 100; p.lk = false; p.ls = 0; p.m = 'poly'; return { ok: true, $ }; }
  upd(dt, rain) { const hrs = dt / 3600; if (rain > 0) this.rain(rain); for (const p of this.pumps.values()) if (p.run) { p.hr += hrs; p.cond = Math.max(0, p.cond - hrs * 0.02); if (p.hr - p.lm >= p.s.mi) p.cond = Math.max(0, p.cond - 5); } this.leak(); for (const t of this.tanks.values()) if (t.s.grav && t.out) { } this.sched(); }
  sched() { const now = new Date(), d = now.getDay(), h = now.getHours(), m = now.getMinutes(); for (const z of this.zones.values()) if (z.en) for (const s of z.sc) if (s.en && s.d === d && s.h === h && m === 0) this.run(z.id, s.dur); }
  getPump(id) { return this.pumps.get(id); } allP() { return Array.from(this.pumps.values()); } getTank(id) { return this.tanks.get(id); } allT() { return Array.from(this.tanks.values()); } getPipe(id) { return this.pipes.get(id); } allPip() { return Array.from(this.pipes.values()); } getZone(id) { return this.zones.get(id); } allZ() { return Array.from(this.zones.values()); } src(id) { return this.src.get(id); } stats() { const l = Array.from(this.pipes.values()).filter(p => p.lk).length; return { pr: this.pres, fl: this.flow, ekw: this.ekw, dl: this.dl, wu: this.wu, lk: l }; }
  bill() { const ec = this.ekw * 0.28, wc = this.wu * 2.1; return { e: ec, w: wc, t: ec + wc }; }
  reset() { this.ekw = 0; this.dl = 0; this.wu = 0; }
}