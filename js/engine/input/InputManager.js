// InputManager - Handles keyboard, mouse, and gamepad input

export const KeyAction = {
  MOVE_UP: 'move_up', MOVE_DOWN: 'move_down', MOVE_LEFT: 'move_left', MOVE_RIGHT: 'move_right',
  RUN: 'run', INTERACT: 'interact', TOOL_USE: 'tool_use', TOOL_SEC: 'tool_sec',
  INV: 'inv', NOTE: 'note', MAP: 'map', JRNL: 'jrnl',
  H1: 'h1', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h5', H6: 'h6', H7: 'h7', H8: 'h8',
  PAUSE: 'pause', DBG: 'dbg', SS: 'ss',
  VENT: 'vent', VPTO: 'vpto', VHCH: 'vhch', VHL: 'vhl', VUN: 'vun', VGUP: 'vgup', VGDN: 'vgdn',
  MGACT: 'mgact', MGCAN: 'mgcan',
  UIU: 'uiu', UID: 'uid', UIL: 'uil', UIR: 'uir', UIC: 'uic', UIB: 'uib'
};

const DEFAULT_BIND = {
  move_up: ['ArrowUp', 'KeyW'], move_down: ['ArrowDown', 'KeyS'], move_left: ['ArrowLeft', 'KeyA'], move_right: ['ArrowRight', 'KeyD'],
  run: ['ShiftLeft', 'ShiftRight'], interact: ['KeyE'], tool_use: ['Space'], tool_sec: ['KeyQ'],
  inv: ['KeyI', 'Tab'], note: ['KeyN'], map: ['KeyM'], jrnl: ['KeyJ'],
  h1: ['Digit1'], h2: ['Digit2'], h3: ['Digit3'], h4: ['Digit4'], h5: ['Digit5'], h6: ['Digit6'], h7: ['Digit7'], h8: ['Digit8'],
  pause: ['Escape'], dbg: ['F3'], ss: ['F2'],
  vent: ['KeyE'], vpto: ['KeyF'], vhch: ['KeyV'], vhl: ['KeyH'], vun: ['KeyU'], vgup: ['KeyW'], vgdn: ['KeyS'],
  mgact: ['Space'], mgcan: ['Escape'],
 uiu: ['ArrowUp', 'KeyW'], uid: ['ArrowDown', 'KeyS'], uil: ['ArrowLeft', 'KeyA'], uir: ['ArrowRight', 'KeyD'], uic: ['Enter', 'Space'], uib: ['Escape', 'KeyE']
};

const GP_BTN = { 0: 'interact', 1: 'tool_use', 2: 'tool_sec', 3: 'inv', 4: 'vhch', 5: 'vpto', 6: 'vhl', 7: 'vun', 8: 'note', 9: 'map', 10: 'run', 11: 'vent', 12: 'uiu', 13: 'uid', 14: 'uil', 15: 'uir' };

export class InputManager {
  constructor() {
    this.keys = new Set();
    this.mousePos = { x: 0, y: 0 };
    this.mouseWorldPos = { x: 0, y: 0 };
    this.mouseDown = false;
    this.mouseRightDown = false;
    this.wheelDelta = 0;
    this.gamepadConnected = false;
    this.gamepadIndex = -1;
    this.gamepadAxes = [0, 0, 0, 0];
    this.gamepadButtons = new Array(16).fill(false);
    this.bind = { ...DEFAULT_BIND };
    this.actionState = new Map();
    this.actionPressed = new Map();
    this.actionReleased = new Map();
    this.prevActionState = new Map();
    this.callbacks = new Map();
    this.textCallbacks = [];
    this.textInputActive = false;
    this.textInputBuffer = '';
    this.textInputMax = 0;
    this.setupListeners();
    this.startGamepadPoll();
  }

  setupListeners() {
    window.addEventListener('keydown', e => this.onKeyDown(e));
    window.addEventListener('keyup', e => this.onKeyUp(e));
    window.addEventListener('mousemove', e => this.onMouseMove(e));
    window.addEventListener('mousedown', e => { if (e.button === 0) this.mouseDown = true; if (e.button === 2) this.mouseRightDown = true; });
    window.addEventListener('mouseup', e => { if (e.button === 0) this.mouseDown = false; if (e.button === 2) this.mouseRightDown = false; });
    window.addEventListener('wheel', e => this.wheelDelta = e.deltaY > 0 ? 1 : -1);
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('gamepadconnected', e => { this.gamepadConnected = true; this.gamepadIndex = e.gamepad.index; console.log('GP:', e.gamepad.id); });
    window.addEventListener('gamepaddisconnected', e => { if (e.gamepad.index === this.gamepadIndex) { this.gamepadConnected = false; this.gamepadIndex = -1; } });
  }

  onKeyDown(e) {
    this.keys.add(e.code);
    for (const [action, codes] of Object.entries(this.bind)) if (codes.includes(e.code)) this.setAction(action, true);
    if (this.isGameKey(e.code)) e.preventDefault();
  }
  onKeyUp(e) {
    this.keys.delete(e.code);
    for (const [action, codes] of Object.entries(this.bind)) if (codes.includes(e.code)) this.setAction(action, false);
  }
  onMouseMove(e) { const r = e.target.getBoundingClientRect(); this.mousePos.x = e.clientX - r.left; this.mousePos.y = e.clientY - r.top; }
  isGameKey(c) { for (const codes of Object.values(this.bind)) if (codes.includes(c)) return true; return false; }
  setAction(action, pressed) {
    const was = this.actionState.get(action) || false;
    if (pressed !== was) { this.actionState.set(action, pressed); this.actionPressed.set(action, pressed); this.actionReleased.set(action, !pressed); const cb = this.callbacks.get(action); if (cb) cb(pressed); }
  }

  update() { this.actionPressed.clear(); this.actionReleased.clear(); this.wheelDelta = 0; this.prevActionState = new Map(this.actionState); }
  pressed(a) { return this.actionPressed.get(a) || false; } released(a) { return this.actionReleased.get(a) || false; } down(a) { return this.actionState.get(a) || false; } wasDown(a) { return this.prevActionState.get(a) || false; }
  mv() { let x = 0, y = 0; if (this.down('move_left')) x--; if (this.down('move_right')) x++; if (this.down('move_up')) y--; if (this.down('move_down')) y++; if (x && y) { const l = Math.hypot(x, y); x /= l; y /= l; } return { x, y }; }
  mvd() { const v = this.mv(); if (!v.x && !v.y) return 'down'; return Math.abs(v.x) > Math.abs(v.y) ? (v.x > 0 ? 'right' : 'left') : (v.y > 0 ? 'down' : 'up'); }
  run() { return this.down('run'); }
  hb() { for (let i = 1; i <= 8; i++) if (this.pressed('h' + i)) return i - 1; return null; }
  mp() { return { ...this.mousePos }; } mwp(p) { this.mouseWorldPos = p; } mwp2() { return { ...this.mouseWorldPos }; } md() { return this.mouseDown; } mrd() { return this.mouseRightDown; } wd() { return this.wheelDelta; }
  gp() { return this.gamepadConnected; } gax() { return [...this.gamepadAxes]; } gbn() { return [...this.gamepadButtons]; }
  on(a, cb) { this.callbacks.set(a, cb); return () => this.callbacks.delete(a); }
  onTxt(cb) { this.textCallbacks.push(cb); return () => { const i = this.textCallbacks.indexOf(cb); if (i >= 0) this.textCallbacks.splice(i, 1); } }
  txtOn(m = 100) { this.textInputActive = true; this.textInputBuffer = ''; this.textInputMax = m; } txtOff() { const r = this.textInputBuffer; this.textInputActive = false; this.textInputBuffer = ''; return r; } txtGet() { return this.textInputBuffer; } txtSet(t) { this.textInputBuffer = t.slice(0, this.textInputMax); for (const cb of this.textCallbacks) cb(this.textInputBuffer); } txtAct() { return this.textInputActive; }

  startGamepadPoll() { setInterval(() => this.pollGP(), 100); }
  pollGP() { if (this.gamepadIndex < 0) return; const gp = navigator.getGamepads()[this.gamepadIndex]; if (!gp) return; this.gamepadAxes = Array.from(gp.axes); for (let i = 0; i < gp.buttons.length; i++) { const p = gp.buttons[i].pressed, w = this.gamepadButtons[i]; this.gamepadButtons[i] = p; const a = GP_BTN[i]; if (a && p !== w) this.setAction(a, p); } const dz = 0.2, lx = gp.axes[0] || 0, ly = gp.axes[1] || 0; this.setAction('move_left', lx < -dz); this.setAction('move_right', lx > dz); this.setAction('move_up', ly < -dz); this.setAction('move_down', ly > dz); }
}