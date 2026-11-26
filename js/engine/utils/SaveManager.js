// SaveManager - localStorage persistence

export class SaveManager {
  constructor() { this.key = 'cosy_harvest_saves'; this.max = 5; this.autoSlot = 0; this.autoTimer = 0; this.playtime = 0; this.loadList(); }
  createSave(state) { return { v: 1, t: Date.now(), p: state.player, ti: state.time, w: state.weather, u: state.utilities, ch: this.compressChunks(state.chunks), pa: this.compressMap(state.paddocks), vh: this.compressMap(state.vehicles), im: this.compressMap(state.implements), ca: this.compressMap(state.cattle), pg: this.compressMap(state.pigs), em: this.compressMap(state.employees), b: state.buildings, q: state.quests }; }
  save(slot, state, shot) { try { const d = this.createSave(state); const s = { slot, t: d.t, v: d.v, pt: this.playtime, d: state.time.d, se: state.time.s, y: state.time.y, $: state.player.inv.find(i => i.id === 'money')?.q || 0, n: 'Farmer', shot }; const ls = this.getList(); ls[slot] = s; localStorage.setItem(this.key + '_' + slot, JSON.stringify(d)); localStorage.setItem(this.key, JSON.stringify(ls)); return true; } catch (e) { console.error(e); return false; } }
  auto(state) { this.autoTimer = 0; this.save(this.autoSlot, state); }
  tick(dt, state) { this.autoTimer += dt; this.playtime += dt; if (this.autoTimer >= 300) this.auto(state); }
  load(slot) { try { const d = localStorage.getItem(this.key + '_' + slot); if (!d) return null; const p = JSON.parse(d); if (p.v !== 1) this.migrate(p); return this.decompress(p); } catch (e) { return null; } }
  del(slot) { try { localStorage.removeItem(this.key + '_' + slot); const ls = this.getList(); delete ls[slot]; localStorage.setItem(this.key, JSON.stringify(ls)); return true; } catch { return false; } }
  getList() { try { const d = localStorage.getItem(this.key); if (!d) return Array(this.max + 1).fill(null).map((_, i) => ({ slot: i, t: 0, v: 0, pt: 0, d: 0, se: '', y: 0, $: 0, n: '' })); return JSON.parse(d); } catch { return Array(this.max + 1).fill(null).map((_, i) => ({ slot: i, t: 0, v: 0, pt: 0, d: 0, se: '', y: 0, $: 0, n: '' })); } }
  loadList() { const ls = this.getList(); if (!ls.length) localStorage.setItem(this.key, JSON.stringify(Array(this.max + 1).fill(null))); }
  migrate(d) { console.log('migrate', d.v, '-> 1'); d.v = 1; }
  compressMap(m) { return Array.from(m.entries()).map(([k, v]) => [k, v]); }
  compressChunks(m) { return Array.from(m.entries()).map(([k, v]) => [k, { x: v.x, y: v.y, w: v.w, h: v.h, t: v.tiles }]); }
  decompress(d) { return { player: d.p, time: d.ti, weather: d.w, utilities: d.u, chunks: new Map(d.ch.map(([k, v]) => [k, { x: v.x, y: v.y, w: v.w, h: v.h, tiles: v.t, entities: new Map(), soilData: new Map(), crops: new Map(), generated: true }])), paddocks: new Map(d.pa), vehicles: new Map(d.vh), implements: new Map(d.im), cattle: new Map(d.ca), pigs: new Map(d.pg), employees: new Map(d.em), buildings: d.b, quests: d.q }; }
}