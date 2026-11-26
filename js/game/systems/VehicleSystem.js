// VehicleSystem - Drivable machinery

export const VEHICLE_SPECS = {
  ute_1984: { name: '1984 Rusty Farm Ute', hp: 85, maxSpd: 120, fuelCap: 80, fuelUse: 12, wt: 1800, turnR: 6, gears: [-3.5, 0, 3.8, 2.2, 1.4, 1.0, 0.8], pto: 0, hyd: 0, lift: 1000, $: 0 },
  truck_1992: { name: '1992 Cab-Over Diesel Truck', hp: 240, maxSpd: 90, fuelCap: 300, fuelUse: 28, wt: 8500, turnR: 10, gears: [-4.2, 0, 6.5, 4.1, 2.8, 1.8, 1.3, 1.0, 0.8], pto: 0, hyd: 0, lift: 6000, $: 45000 },
  tractor_vintage_45hp: { name: 'Vintage 45HP Tractor', hp: 45, maxSpd: 25, fuelCap: 60, fuelUse: 8, wt: 2200, turnR: 3.5, gears: [-4.0, 0, 4.5, 3.2, 2.1, 1.5, 1.1], pto: 540, hyd: 25, lift: 1200, $: 18000 },
  tractor_rowcrop_140hp: { name: '140HP Row-Crop Tractor', hp: 140, maxSpd: 40, fuelCap: 200, fuelUse: 22, wt: 5800, turnR: 4.5, gears: [-4.5, 0, 5.2, 3.8, 2.6, 1.8, 1.3, 1.0, 0.8], pto: 540, hyd: 80, lift: 4500, $: 85000 },
  combine_harvester: { name: 'Combine Harvester', hp: 320, maxSpd: 25, fuelCap: 500, fuelUse: 45, wt: 15000, turnR: 6, gears: [-3.0, 0, 2.5, 1.8, 1.3, 1.0], pto: 1000, hyd: 120, lift: 0, $: 180000 },
  loader_articulated: { name: 'Articulated Loader', hp: 110, maxSpd: 30, fuelCap: 150, fuelUse: 18, wt: 7200, turnR: 4, gears: [-3.5, 0, 4.0, 2.5, 1.6, 1.1], pto: 0, hyd: 100, lift: 3500, $: 72000 },
  trailer_livestock: { name: 'Livestock Trailer', hp: 0, maxSpd: 80, fuelCap: 0, fuelUse: 0, wt: 1200, turnR: 8, gears: [], pto: 0, hyd: 0, lift: 0, $: 8000 },
  trailer_fuel: { name: 'Fuel Bowser', hp: 0, maxSpd: 80, fuelCap: 2000, fuelUse: 0, wt: 2500, turnR: 8, gears: [], pto: 0, hyd: 0, lift: 0, $: 12000 },
  trailer_flatbed: { name: 'Flatbed Trailer', hp: 0, maxSpd: 80, fuelCap: 0, fuelUse: 0, wt: 3000, turnR: 9, gears: [], pto: 0, hyd: 0, lift: 0, $: 15000 }
};

export class VehicleManager {
  constructor() { this.vehicles = new Map(); this.physics = new Map(); this.playerVeh = null; }
  create(type, id, pos, dir = 'down') { const s = VEHICLE_SPECS[type]; if (!s) return null; const v = { id, type, pos: { ...pos }, dir, run: false, gear: 0, spd: 0, maxSpd: s.maxSpd, fuel: s.fuelCap, maxFuel: s.fuelCap, tmp: 20, oil: 40, dust: 0, pto: false, hitch: false, lights: false, impl: null, drv: null, pass: [], cargo: [], dmg: { eng: 0, trn: 0, hyd: 0, tyr: 0, bod: 0 } }; this.vehicles.set(id, v); const ph = new VehiclePhysics(type); ph.setPos(pos); ph.setAng(this.dir2ang(dir)); this.physics.set(id, ph); return v; }
  get(id) { return this.vehicles.get(id); } all() { return Array.from(this.vehicles.values()); }
  enter(id, drv) { const v = this.vehicles.get(id); if (!v || v.drv) return false; v.drv = drv; v.run = true; this.playerVeh = id; return true; }
  exit(id) { const v = this.vehicles.get(id); if (!v) return false; v.drv = null; v.run = false; v.gear = 0; if (this.playerVeh === id) this.playerVeh = null; return true; }
  update(id, input, dt) { const v = this.vehicles.get(id); const ph = this.physics.get(id); if (!v || !ph || !v.run) return; ph.update(input, dt); const st = ph.getState(); v.pos = st.pos; v.dir = this.ang2dir(st.ang); v.spd = st.vel.x * Math.cos(st.ang) + st.vel.y * Math.sin(st.ang); v.gear = st.gear; v.fuel = ph.useFuel(v.fuel); const load = input.thr * (st.rpm / 2500); const tTmp = 80 + load * 30; v.tmp += (tTmp - v.tmp) * 0.01 * dt * 60; if (v.tmp > 110) v.dmg.eng += (v.tmp - 110) * 0.001 * dt * 60; v.dust += load * 0.01 * dt * 60; }
  hitch(id, implId) { const v = this.vehicles.get(id); if (!v || v.impl) return false; v.impl = implId; return true; }
  unhitch(id) { const v = this.vehicles.get(id); if (!v || !v.impl) return null; const i = v.impl; v.impl = null; v.hitch = false; v.pto = false; return i; }
  togglePTO(id) { const v = this.vehicles.get(id); if (!v || !v.impl) return false; v.pto = !v.pto; return true; }
  toggleHitch(id) { const v = this.vehicles.get(id); if (!v || !v.impl) return false; v.hitch = !v.hitch; return true; }
  toggleLights(id) { const v = this.vehicles.get(id); if (!v) return false; v.lights = !v.lights; return true; }
  fuel(id, amt) { const v = this.vehicles.get(id); if (!v) return 0; const a = Math.min(amt, v.maxFuel - v.fuel); v.fuel += a; return a; }
  repair(id, part, amt) { const v = this.vehicles.get(id); if (!v) return; v.dmg[part] = Math.max(0, v.dmg[part] - amt); }
  getPlayer() { if (!this.playerVeh) return null; return this.vehicles.get(this.playerVeh) || null; }
  dir2ang(d) { switch (d) { case 'down': return Math.PI / 2; case 'up': return -Math.PI / 2; case 'left': return Math.PI; case 'right': return 0; } }
  ang2dir(a) { while (a < -Math.PI) a += Math.PI * 2; while (a > Math.PI) a -= Math.PI * 2; if (a >= -Math.PI / 4 && a < Math.PI / 4) return 'right'; if (a >= Math.PI / 4 && a < 3 * Math.PI / 4) return 'down'; if (a >= -3 * Math.PI / 4 && a < -Math.PI / 4) return 'up'; return 'left'; }
}

class VehiclePhysics {
  constructor(type) { this.spec = VEHICLE_SPECS[type]; this.st = { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ang: 0, angVel: 0, gear: 0, rpm: 800, thr: 0, brk: 0, str: 0, grd: true }; }
  getSpec() { return this.spec; } getState() { return { ...this.st }; }
  setPos(p) { this.st.pos = p; } setAng(a) { this.st.ang = a; }
  update(inp, dt) {
    if (inp.gearUp && this.st.gear < this.spec.gears.length - 1) this.st.gear++;
    if (inp.gearDn && this.st.gear > 0) this.st.gear--;
    this.st.thr = Math.max(0, Math.min(1, inp.thr)); this.st.brk = Math.max(0, Math.min(1, inp.brk));
    const ms = Math.PI / 6; this.st.str = Math.max(-ms, Math.min(ms, inp.str));
    this.updRPM();
    const f = this.driveForce(), d = this.drag(), b = this.brakeForce(), nf = f - d - b;
    const ax = Math.cos(this.st.ang) * nf / this.spec.wt, ay = Math.sin(this.st.ang) * nf / this.spec.wt;
    this.st.vel.x += ax * dt; this.st.vel.y += ay * dt;
    if (this.speed() > 0.5) { this.st.angVel = this.speed() * Math.tan(this.st.str) / (this.spec.turnR * 2); this.st.ang += this.st.angVel * dt; } else this.st.angVel = 0;
    this.st.pos.x += this.st.vel.x * dt; this.st.pos.y += this.st.vel.y * dt;
    this.st.vel.x *= 0.98; this.st.vel.y *= 0.98; if (this.speed() < 0.05) { this.st.vel.x = 0; this.st.vel.y = 0; }
  }
  updRPM() { const gr = this.spec.gears[this.st.gear] || 1; const wr = this.speed() * 60 / (Math.PI * 0.8); const tr = wr * Math.abs(gr) * 4; if (this.st.gear === 0) this.st.rpm = this.st.rpm + (800 + this.st.thr * 1500 - this.st.rpm) * 0.1; else { this.st.rpm = this.st.rpm + (Math.max(800, tr) - this.st.rpm) * 0.15; this.st.rpm = Math.min(this.st.rpm, 2500); } }
  driveForce() { if (this.st.gear === 0) return 0; const gr = this.spec.gears[this.st.gear], et = this.engTorque(this.st.rpm), wt = et * Math.abs(gr) * 4 * 0.85, wr = 0.4; return wt / wr; }
  engTorque(rpm) { const nr = rpm / 2500; if (nr < 0.3) return this.spec.hp * 746 / 800 * 0.5; if (nr < 0.7) return this.spec.hp * 746 / 1800; return this.spec.hp * 746 / rpm * 0.8; }
  drag() { const sp = this.speed(); return 0.5 * 1.2 * 0.8 * 4 * sp * sp + this.spec.wt * 9.81 * 0.015; }
  brakeForce() { if (this.st.brk <= 0) return 0; return this.st.brk * this.spec.wt * 9.81 * 0.8; }
  speed() { return Math.hypot(this.st.vel.x, this.st.vel.y); }
  useFuel(f) { const c = this.spec.fuelUse * (this.st.thr * (this.st.rpm / 2500)) / 3600; return Math.max(0, f - c * (1 / 60)); }
}