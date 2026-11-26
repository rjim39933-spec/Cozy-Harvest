console.log('=== MAIN.JS LOADED ===');

// Main entry point - Cosy Harvest: Pelican Hollow

window.onerror = (msg, src, ln, col, err) => {
  const dbg = document.getElementById('dbg');
  if (dbg) dbg.textContent = 'ERROR: ' + msg + '\n' + err?.stack;
  console.error(msg, err);
  return true;
};

window.addEventListener('unhandledrejection', e => {
  const dbg = document.getElementById('dbg');
  if (dbg) dbg.textContent = 'PROMISE ERROR: ' + (e.reason?.message || e.reason);
  console.error(e.reason);
});

console.log('Starting imports...');

// Main entry point - Cosy Harvest: Pelican Hollow

import { Renderer } from './engine/rendering/Renderer.js';
import { InputManager } from './engine/input/InputManager.js';
import { AssetLoader } from './engine/utils/AssetLoader.js';
import { AudioManager } from './engine/audio/AudioManager.js';
import { SaveManager } from './engine/utils/SaveManager.js';
import { UISystem } from './game/ui/UISystem.js';
import { VehicleManager } from './game/systems/VehicleSystem.js';
import { CattleManager } from './game/systems/CattleSystem.js';
import { CropEngine } from './game/systems/CropSystem.js';
import { EmployeeManager } from './game/systems/EmployeeSystem.js';
import { WorldManager } from './game/world/WorldManager.js';
import { IrrigationManager } from './game/systems/IrrigationSystem.js';
import { TruffleManager } from './game/systems/TruffleSystem.js';
import { MinigameManager } from './game/minigames/Minigames.js';
import { GAME_CONFIG, formatDate, formatTime, formatMoney } from './engine/constants.js';

console.log('All imports loaded successfully');

const canvas = document.getElementById('c');
console.log('Canvas:', canvas);
const R = new Renderer(canvas);
console.log('Renderer created');
const I = new InputManager();
console.log('InputManager created');
const AL = new AssetLoader();
console.log('AssetLoader created');
const A = new AudioManager();
console.log('AudioManager created');
const SM = new SaveManager();
console.log('SaveManager created');
const UI = new UISystem(R, I);
console.log('UISystem created');
const VM = new VehicleManager();
console.log('VehicleManager created');
const CM = new CattleManager();
console.log('CattleManager created');
const CE = new CropEngine();
console.log('CropEngine created');
const EM = new EmployeeManager();
console.log('EmployeeManager created');
const WM = new WorldManager();
console.log('WorldManager created');
const IM = new IrrigationManager();
console.log('IrrigationManager created');
const TM = new TruffleManager();
console.log('TruffleManager created');
const MG = new MinigameManager(R, I, A);
console.log('MinigameManager created');

let running = true, last = 0, acc = 0, dtFix = 1 / 60;
const P = { pos: { x: GAME_CONFIG.STARTING_POSITION.x * 16, y: GAME_CONFIG.STARTING_POSITION.y * 16 }, dir: 'down', stm: GAME_CONFIG.PLAYER_MAX_STAMINA, mstm: GAME_CONFIG.PLAYER_MAX_STAMINA, mood: 'energetic', inv: Array(40).fill().map(() => ({ id: null, q: 0 })), hb: ['hoe_worn', 'watering_can', 'seed_wheat', 'seed_tomato', 'silicon_sealant', 'fence_wire', 'gate_kit', null], hbs: 0, carry: null, tool: 'hoe_worn', veh: null };
const T = { h: 7, m: 0, d: 1, s: 'spring', y: 1, dw: 'mon', ts: GAME_CONFIG.BASE_TIME_SCALE };
const W = { t: 'clear', i: 0, tmp: 22, hum: 45, ws: 5, wd: 'down', pre: 0, cc: 10, fc: [{ do: 0, t: 'clear', mn: 15, mx: 25, pc: 10 }, { do: 1, t: 'cloudy', mn: 14, mx: 22, pc: 30 }, { do: 2, t: 'rain', mn: 12, mx: 18, pc: 80 }] };
let icd = 0, pa = 0, gt = 0;

async function init() {
  try {
    console.log('init() starting immediately');
    const dbg = document.getElementById('dbg');
    if (dbg) dbg.textContent = 'Init: Audio...';
    await A.init(); A.genSFX();
    if (dbg) dbg.textContent = 'Init: Assets...';
    const chS = genChar(), vhS = genVeh(), ctS = genCat(), uiS = genUI();
    mkSheets(chS, vhS, ctS, uiS);
    if (dbg) dbg.textContent = 'Init: World...';
    genWorld();
    if (dbg) dbg.textContent = 'Init: Systems...';
    VM.create('ute_1984', 'player_ute', P.pos, 'down'); VM.enter('player_ute', 'player'); P.veh = 'player_ute';
    CM.starter();
    const apps = EM.getApps(); if (apps.length) EM.hire(apps[0].id);
    IM.install('creek_5', { x: 57 * 16, y: 15 * 16 }, 'creek', false);
    TM.setSea(T.s, T.d, T.y);
    
    // Resize canvas to window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    R.resize(canvas.width, canvas.height);
    
    running = true; last = performance.now(); requestAnimationFrame(loop);
    if (dbg) dbg.textContent = 'GAME RUNNING - Click to focus';
    
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      R.resize(canvas.width, canvas.height);
    });
  } catch (e) {
    document.body.style.background = '#dc2626';
    document.body.innerHTML = '<pre style="color:#fff;padding:20px;font:14px monospace">ERROR: ' + e.message + '\n\n' + e.stack + '</pre>';
    console.error(e);
  }
}

function genChar() { const m = new Map(), w = 24, h = 32, ds = ['down', 'up', 'left', 'right'], cl = { sk: '#fdb88a', sh: '#466d33', pn: '#3d2f1f', bt: '#2a1a1f', hr: '#3d2f1f', ht: '#4a2511' }; for (const d of ds) for (let f = 0; f < 4; f++) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; const by = 8; x.fillStyle = cl.sh; x.fillRect(4, by, 16, 16); x.fillStyle = cl.pn; x.fillRect(4, by + 12, 16, 8); x.fillStyle = cl.bt; const bo = f % 2 ? 0 : 2; if (d === 'down' || d === 'up') { x.fillRect(4, by + 20 + bo, 6, 4); x.fillRect(14, by + 20 - bo, 6, 4); } else { x.fillRect(4 + bo, by + 20, 6, 4); x.fillRect(14 - bo, by + 20, 6, 4); } x.fillStyle = cl.sk; if (d === 'down') { x.fillRect(6, 2, 12, 10); x.fillStyle = '#000'; x.fillRect(8, 5, 2, 2); x.fillRect(14, 5, 2, 2); } else if (d === 'up') { x.fillRect(6, 2, 12, 10); x.fillStyle = cl.hr; x.fillRect(6, 2, 12, 4); } else { x.fillRect(6, 2, 12, 10); x.fillStyle = '#000'; x.fillRect(d === 'right' ? 16 : 6, 5, 2, 2); } x.fillStyle = cl.ht; x.fillRect(5, 0, 14, 3); x.fillStyle = cl.sk; const as = f % 2 ? 2 : -2; if (d === 'down' || d === 'up') { x.fillRect(2 + as, by + 2, 4, 10); x.fillRect(18 - as, by + 2, 4, 10); } else { x.fillRect(8, by + 2 + as, 8, 4); x.fillRect(8, by + 12 - as, 8, 4); } m.set(`pl_${d}_${f}`, cv); } return m; }
function genVeh() { const m = new Map(), vs = [{ n: 'ute_1984', w: 64, h: 32, c: '#6b4a3a', cc: '#4a3a2a' }, { n: 'truck_1992', w: 96, h: 40, c: '#5a5a5a', cc: '#3a3a3a' }, { n: 'tractor_vintage_45hp', w: 48, h: 48, c: '#466d33', cc: '#2d4a1a' }, { n: 'tractor_rowcrop_140hp', w: 64, h: 56, c: '#dc2626', cc: '#8b1a1a' }, { n: 'combine_harvester', w: 96, h: 64, c: '#fde047', cc: '#c9b037' }, { n: 'loader_articulated', w: 56, h: 48, c: '#f97316', cc: '#c95a16' }]; for (const v of vs) for (let d = 0; d < 4; d++) { const cv = document.createElement('canvas'); cv.width = v.w; cv.height = v.h; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.save(); x.translate(v.w / 2, v.h / 2); x.rotate(d * Math.PI / 2); x.translate(-v.w / 2, -v.h / 2); x.fillStyle = v.c; x.fillRect(4, 8, v.w - 8, v.h - 16); x.fillStyle = v.cc; x.fillRect(8, 4, v.w - 16, 12); x.fillStyle = '#1a1a1a'; const wr = 6; for (const [px, py] of [[8, v.h - 8], [v.w - 8, v.h - 8], [8, 12], [v.w - 8, 12]]) { x.beginPath(); x.ellipse(px, py, wr, wr, 0, 0, Math.PI * 2); x.fill(); } x.fillStyle = '#3a3a3a'; x.fillRect(v.w - 10, 6, 4, 8); x.restore(); m.set(v.n + '_' + d, cv); } return m; }
function genCat() { const m = new Map(), br = [{ n: 'angus', b: '#1a1a1a', h: '#fefef5' }, { n: 'hereford', b: '#8b3e2f', w: '#fefef5' }, { n: 'wagyu_tajima', b: '#0a0a0a' }, { n: 'brahman', b: '#6b6b6b', hu: '#5a5a5a' }, { n: 'santa_gertrudis', b: '#a04030' }], ag = ['calf', 'heifer', 'cow', 'bull', 'steer'], ds = ['down', 'up', 'left', 'right']; for (const b of br) for (const a of ag) { const sc = a === 'calf' ? .5 : 1, w = Math.floor(48 * sc), h = Math.floor(32 * sc); for (const d of ds) for (let f = 0; f < 4; f++) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.save(); x.scale(sc, sc); x.translate(24, 16); x.rotate(d === 'up' ? Math.PI : d === 'left' ? -Math.PI / 2 : d === 'right' ? Math.PI / 2 : 0); x.translate(-24, -16); x.fillStyle = b.b; x.fillRect(4, 8, 40, 20); if (b.n === 'hereford') { x.fillStyle = b.w; x.fillRect(4, 8, 16, 12); x.fillRect(4, 20, 12, 8); } else if (b.n === 'brahman') { x.fillStyle = b.hu; x.fillRect(18, 4, 16, 8); x.fillRect(4, 20, 10, 8); } x.fillStyle = '#1a1a1a'; const lo = f % 2 ? 0 : 2; x.fillRect(8, 28 + lo, 6, 8); x.fillRect(18, 28 - lo, 6, 8); x.fillRect(30, 28 + lo, 6, 8); x.fillRect(40, 28 - lo, 6, 8); x.fillStyle = b.b; if (d === 'down') { x.fillRect(2, 4, 16, 8); x.fillRect(0, 4, 4, 4); x.fillRect(18, 4, 4, 4); } if (a === 'bull' && b.h) { x.fillStyle = b.h; x.fillRect(4, 2, 4, 6); x.fillRect(14, 2, 4, 6); } if (a !== 'calf') { x.fillStyle = '#fde047'; x.fillRect(20, 6, 3, 3); } x.restore(); m.set(`cat_${b.n}_${a}_${d}_${f}`, cv); } } return m; }
function genUI() { const m = new Map(), sz = 48; const cv = document.createElement('canvas'); cv.width = sz; cv.height = sz; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '#1a120a'; x.fillRect(0, 0, sz, sz); x.strokeStyle = '#7c4d2b'; x.lineWidth = 2; x.strokeRect(1, 1, sz - 2, sz - 2); m.set('hb_slot', cv); const cv2 = document.createElement('canvas'); cv2.width = sz; cv2.height = sz; const x2 = cv2.getContext('2d'); x2.imageSmoothingEnabled = false; x2.fillStyle = '#1a120a'; x2.fillRect(0, 0, sz, sz); x2.strokeStyle = '#fde047'; x2.lineWidth = 3; x2.strokeRect(1, 1, sz - 2, sz - 2); m.set('hb_sel', cv2); return m; }
function mkSheets(cS, vS, ctS, uS) { const mk = (src, fw, fh, cols, rows) => { const cv = document.createElement('canvas'); cv.width = fw * cols; cv.height = fh * rows; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; let i = 0; for (const [, v] of src) { const c = i % cols, r = Math.floor(i / cols); if (r >= rows) break; x.drawImage(v, c * fw, r * fh); i++; } return cv; }; const cc = mk(cS, 24, 32, 4, 4); R.createSpriteSheetFromCanvas('pl', cc, 24, 32); for (const d of ['down', 'up', 'left', 'right']) { const di = ['down', 'up', 'left', 'right'].indexOf(d), fr = [0, 1, 2, 3].map(f => ({ x: f * 24, y: di * 32, w: 24, h: 32 })); R.defineAnimation('pl', 'walk_' + d, fr, 150); R.defineAnimation('pl', 'idle_' + d, [{ x: 0, y: di * 32, w: 24, h: 32 }], 1e3, false); } const vc = mk(vS, 64, 64, 8, 4); R.createSpriteSheetFromCanvas('vh', vc, 64, 64); const cac = mk(ctS, 48, 32, 16, 10); R.createSpriteSheetFromCanvas('cat', cac, 48, 32); const uc = mk(uS, 200, 100, 4, 4); R.createSpriteSheetFromCanvas('ui', uc, 200, 100); }
function genWorld() {
  const tiles = ['grass', 'grass_flower', 'dirt', 'tilled_dry', 'tilled_moist', 'tilled_rich', 'tilled_compacted', 'water', 'water_ripple', 'stone', 'stepping_stone', 'log_cabin_floor', 'log_cabin_wall', 'chimney', 'window', 'door_closed', 'door_open', 'concrete', 'wooden_plank', 'fence_post', 'fence_wire', 'gate_closed', 'gate_open'];
  for (const t of tiles) R.getOrCreateTileCanvas(t);
  R.setWeather(W.t, W.i); R.setTimeOfDay('morning', T.h, T.m);
}
function hideLoad() { document.getElementById('ld').classList.add('hidden'); }

function loop(now) {
  if (!running) return;
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  acc += dt;
  while (acc >= dtFix) { upd(dtFix); acc -= dtFix; }
  rend(acc / dtFix);
  requestAnimationFrame(loop);
}

function upd(dt) {
  I.update();
  if (icd > 0) icd -= dt;
  if (!P.veh) updPl(dt); else updVeh(dt);
  updCam(dt); updTime(dt); R.updateWeather(dt); R.updateParticles(dt); pa += dt; gt += dt;
  A.lstnr({ x: P.pos.x, y: P.pos.y });
  WM.updLoaded(P.pos);
  CM.update(dt, T.h * 60 + T.m);
  CE.upd(dt, { pre: W.pre, tmp: W.tmp, hum: W.hum }, T.h * 60 + T.m);
  EM.upd(dt, T.h, T.d);
  IM.upd(dt, W.pre);
  TM.upd(dt);
  MG.upd(dt);
  UI.upd(dt);
  SM.tick(dt * 1000, createSnap());
}

function updPl(dt) {
  const mv = I.mv(), rn = I.run() && P.stm > 10;
  if (mv.x || mv.y) {
    P.dir = I.mvd();
    let sp = GAME_CONFIG.PLAYER_SPEED;
    if (rn) { sp *= GAME_CONFIG.PLAYER_RUN_MULTIPLIER; P.stm = Math.max(0, P.stm - GAME_CONFIG.PLAYER_STAMINA_DRAIN * dt); P.mood = P.stm <= 20 ? 'grouchy' : P.stm <= 50 ? 'tired' : 'energetic'; }
    else { P.stm = Math.min(P.mstm, P.stm + GAME_CONFIG.PLAYER_STAMINA_REGEN * dt); P.mood = P.stm > 80 ? 'energetic' : P.stm > 40 ? 'tired' : 'grouchy'; }
    const nx = P.pos.x + mv.x * sp * 16 * dt, ny = P.pos.y + mv.y * sp * 16 * dt, tx = Math.floor(nx / 16), ty = Math.floor(ny / 16);
    if (walk(tx, ty)) { P.pos.x = nx; P.pos.y = ny; if (Math.random() < dt * 3) A.play('foot_grass', { v: .1, pos: { x: P.pos.x, y: P.pos.y } }); }
  } else P.stm = Math.min(P.mstm, P.stm + GAME_CONFIG.PLAYER_STAMINA_REGEN * dt * 2);
}
function walk(tx, ty) { if (tx < 0 || tx >= 60 || ty < 0 || ty >= 44) return false; const t = ['water', 'water_ripple', 'log_cabin_wall', 'chimney', 'stone', 'fence_post', 'fence_wire', 'gate_closed']; return !t.includes(WM.getTile(tx * 16, ty * 16)); }
function updVeh(dt) { if (!P.veh) return; const v = VM.get(P.veh); if (!v || !v.run) return; const th = I.down('move_up') ? 1 : I.down('move_down') ? -0.5 : 0, br = I.down('move_down') && th <= 0 ? 1 : 0, st = (I.down('move_right') ? 1 : 0) - (I.down('move_left') ? 1 : 0), gu = I.pressed('vgup'), gd = I.pressed('vgdn'); VM.update(P.veh, { thr: th, brk: br, str: st, gearUp: gu, gearDown: gd }, dt); const v2 = VM.get(P.veh); P.pos = v2.pos; P.dir = v2.dir; }
function updCam(dt) { R.setCameraTarget(P.pos.x, P.pos.y); R.updateCamera(dt); }
function updTime(dt) { const gm = dt * T.ts; T.m += gm; while (T.m >= 60) { T.m -= 60; T.h++; if (T.h >= 24) { T.h = 0; advDay(); } } let tod = 'morning'; if (T.h >= 5 && T.h < 7) tod = 'dawn'; else if (T.h >= 7 && T.h < 12) tod = 'morning'; else if (T.h >= 12 && T.h < 14) tod = 'noon'; else if (T.h >= 14 && T.h < 17) tod = 'afternoon'; else if (T.h >= 17 && T.h < 19) tod = 'evening'; else if (T.h >= 19 && T.h < 22) tod = 'night'; else tod = 'midnight'; R.setTimeOfDay(tod, T.h, T.m); TM.setSea(T.s, T.d, T.y); }
function advDay() { T.d++; const n = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']; T.dw = n[(T.d - 1) % 7]; if (T.d > GAME_CONFIG.SEASON_LENGTH_DAYS) { T.d = 1; advSea(); } W.fc.shift(); W.fc.push({ do: W.fc.length, t: ['clear', 'cloudy', 'rain', 'storm', 'fog'][Math.floor(Math.random() * 5)], mn: 10 + Math.floor(Math.random() * 15), mx: 15 + Math.floor(Math.random() * 20), pc: Math.floor(Math.random() * 100) }); }
function advSea() { const s = ['spring', 'summer', 'autumn', 'winter']; T.s = s[(s.indexOf(T.s) + 1) % 4]; if (T.s === 'spring') T.y++; }

function rend(alp) {
  R.beginFrame();
  // Test pattern - draw a visible rectangle to verify renderer works
  const ctx = R.getCTX();
  ctx.fillStyle = '#466d33';
  ctx.fillRect(10, 10, 100, 50);
  ctx.fillStyle = '#fde047';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('RENDER WORKS', 15, 35);
  
  rendW(); rendEnt(alp); R.renderWeather(); R.renderTimeOverlay(); R.renderLights(); R.renderParticles(); rendUI(); MG.rd(); UI.rd(); R.endFrame();
}
function rendW() {
  const ts = 16, cz = R.getCZ(), sc = R.getS(), cx = R.getCX(), cy = R.getCY();
  const stx = Math.floor(cx / ts) - 1, etx = Math.ceil((cx + R.getW() / (sc * cz)) / ts) + 1;
  const sty = Math.floor(cy / ts) - 1, ety = Math.ceil((cy + R.getH() / (sc * cz)) / ts) + 1;
  for (let ty = sty; ty < ety; ty++) for (let tx = stx; tx < etx; tx++) {
    const p = R.worldToScreen(tx * ts, ty * ts);
    if (p.x > -ts * sc * cz && p.x < R.getW() && p.y > -ts * sc * cz && p.y < R.getH()) {
      const t = WM.getTile(tx * ts, ty * ts);
      const cv = R.getOrCreateTileCanvas(t);
      R.getCTX().drawImage(cv, p.x, p.y, ts * sc * cz, ts * sc * cz);
    }
  }
}
function rendEnt(alp) {
  if (!P.veh) R.drawAnimatedSprite('pl', (I.mv().x || I.mv().y ? 'walk_' : 'idle_') + P.dir, pa * 1000, P.pos.x, P.pos.y, P.dir, { sc: 1.5 });
  const scale = R.getS() * R.getCZ();
  for (const v of VM.all()) { const p = R.worldToScreen(v.pos.x, v.pos.y), x = R.getCTX(), s = scale; x.fillStyle = '#466d33'; x.fillRect(p.x - 24 * s, p.y - 16 * s, 48 * s, 32 * s); }
  for (const c of CM.all()) { const p = R.worldToScreen(c.pos.x, c.pos.y), x = R.getCTX(), s = scale; x.fillStyle = '#1a1a1a'; x.fillRect(p.x - 16 * s, p.y - 12 * s, 32 * s, 24 * s); }
}
function rendUI() {
  const x = R.getCTX(), w = R.getW(), h = R.getH(), sc = R.getS();
  const hx = w - 290 * sc, hy = 10 * sc, hw = 280 * sc, hh = 100 * sc;
  R.drawRect(hx, hy, hw, hh, '#2d1f1a', true); R.drawRect(hx, hy, hw, hh, '#7c4d2b', true);
  R.drawText(formatDate(T.d, T.s, T.y), hx + 10 * sc, hy + 10 * sc, { font: 10 * sc + 'px "Courier New",monospace', color: '#f5e6d3', screenSpace: true });
  R.drawText(formatTime(T.h, T.m), hx + 10 * sc, hy + 28 * sc, { font: 14 * sc + 'px "Courier New",monospace', color: '#fde047', screenSpace: true });
  R.drawText('☀', hx + 200 * sc, hy + 10 * sc, { font: 16 * sc + 'px "Courier New",monospace', color: '#f5e6d3', screenSpace: true });
  R.drawText(formatMoney(GAME_CONFIG.STARTING_MONEY), hx + 10 * sc, hy + 48 * sc, { font: 12 * sc + 'px "Courier New",monospace', color: '#fde047', screenSpace: true });
  R.drawText('Homestead', hx + 10 * sc, hy + 68 * sc, { font: 10 * sc + 'px "Courier New",monospace', color: '#f5e6d3', screenSpace: true });
  const sx = hx + 140 * sc, sy = hy + 48 * sc, sw = 120 * sc, sh = 12 * sc, sp = P.stm / P.mstm;
  x.fillStyle = '#1a120a'; x.fillRect(sx, sy, sw, sh);
  x.strokeStyle = '#7c4d2b'; x.lineWidth = sc; x.strokeRect(sx, sy, sw, sh);
  let sc2 = '#466d33'; if (sp < .3) sc2 = '#dc2626'; else if (sp < .6) sc2 = '#fde047';
  x.fillStyle = sc2; x.fillRect(sx, sy, sw * sp, sh);
  x.fillStyle = { energetic: '#466d33', tired: '#fde047', grouchy: '#f97316', exhausted: '#dc2626' }[P.mood];
  x.fillRect(sx, sy + 16 * sc, 80 * sc, 10 * sc);
  x.fillStyle = '#000'; x.font = 8 * sc + 'px "Courier New",monospace'; x.fillText(P.mood[0].toUpperCase() + P.mood.slice(1), sx + 5 * sc, sy + 17 * sc);
  const slot = 48 * sc, spc = 4 * sc, tw = 8 * slot + 7 * spc, sx2 = (w - tw) / 2, sy2 = h - slot - 10 * sc;
  for (let i = 0; i < 8; i++) { const ix = sx2 + i * (slot + spc), iy = sy2, sel = i === P.hbs; x.fillStyle = sel ? '#fde047' : '#1a120a'; x.fillRect(ix, iy, slot, slot); x.strokeStyle = sel ? '#fde047' : '#7c4d2b'; x.lineWidth = sel ? 3 * sc : 2 * sc; x.strokeRect(ix, iy, slot, slot); x.fillStyle = '#f5e6d3'; x.font = 10 * sc + 'px "Courier New",monospace'; x.fillText(i + 1 + '', ix + 4 * sc, iy + 2 * sc); const it = P.hb[i]; if (it) { x.font = 14 * sc + 'px "Courier New",monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(it.slice(0, 3).toUpperCase(), ix + slot / 2, iy + slot / 2); } }
  const int = nearInt(); if (int.length) { const t = '[E] ' + int[0], fs = 14 * sc; x.font = fs + 'px "Courier New",monospace'; const tw = x.measureText(t).width, pw = tw + 20 * sc, ph = 32 * sc, px = (w - pw) / 2, py = h - 48 * sc - 32 * sc - 10 * sc; x.fillStyle = '#1a1a1a'; x.fillRect(px, py, pw, ph); x.strokeStyle = '#cd953c'; x.lineWidth = 2 * sc; x.strokeRect(px, py, pw, ph); x.fillStyle = '#fde047'; x.font = fs + 'px "Courier New",monospace'; x.fillText(t, px + 10 * sc, py + 8 * sc); }
  const it = P.hb[P.hbs]; if (it && !int.length) { const t = it.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), fs = 12 * sc; x.font = fs + 'px "Courier New",monospace'; const tw = x.measureText(t).width, bw = tw + 20 * sc, bh = 24 * sc, bx = (w - bw) / 2, by = h - 48 * sc - 32 * sc - 10 * sc - bh - 4 * sc; x.fillStyle = '#2d1f1a'; x.fillRect(bx, by, bw, bh); x.strokeStyle = '#7c4d2b'; x.lineWidth = sc; x.strokeRect(bx, by, bw, bh); x.fillStyle = '#f5e6d3'; x.font = fs + 'px "Courier New",monospace'; x.fillText(t, bx + 10 * sc, by + 6 * sc); }
}
function nearInt() { const r = [], px = Math.floor(P.pos.x / 16), py = Math.floor(P.pos.y / 16); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const tx = px + dx, ty = py + dy, t = WM.getTile(tx * 16, ty * 16); if (t === 'door_closed') r.push('Farmhouse Door'); if (t === 'concrete' && tx === 57 && ty === 15) r.push('Creek Pump'); if (t === 'window') r.push('Window'); if (t === 'gate_closed') r.push('Gate'); } if (!P.veh) for (const v of VM.all()) { const d = Math.hypot(v.pos.x - P.pos.x, v.pos.y - P.pos.y); if (d < 50) r.push(v.type.replace(/_/g, ' ')); } return r; }

I.on('interact', p => { if (p && icd <= 0) { icd = .3; const t = nearInt()[0]; if (t === 'Farmhouse Door') A.play('ui_ok', { v: .2 }); else if (t === 'Creek Pump') A.play('ui_ok', { v: .2 }); } });
I.on('tool_use', p => { if (p) { const id = P.hb[P.hbs] || P.tool; if (id) { A.play('hoe_sw', { v: .3, pos: { x: P.pos.x, y: P.pos.y } }); console.log('tool:', id); } } });
for (let i = 1; i <= 8; i++) I.on('h' + i, p => { if (p) P.hbs = i - 1; });
I.on('dbg', p => { if (p) { R.toggleDebug(); R.toggleHitboxes(); R.toggleGrid(); } });
I.on('ss', p => { if (p) { const a = document.createElement('a'); a.download = 'cosy-' + Date.now() + '.png'; a.href = canvas.toDataURL('image/png'); a.click(); } });
I.on('pause', p => { if (p) { running = !running; if (running) { last = performance.now(); requestAnimationFrame(loop); } } });
function createSnap() { return { player: P, time: T, weather: W, utilities: { ekw: 0, wkl: 0, dl: 100, lbd: 0, lba: 0 }, chunks: WM.getChunksMap(), paddocks: CM.getPaddocksMap(), vehicles: VM.vehicles, implements: new Map(), cattle: CM.getCattleMap(), pigs: TM.getPigsMap(), employees: EM.getEmployeesMap(), buildings: [], quests: [] }; }

init().catch(console.error);