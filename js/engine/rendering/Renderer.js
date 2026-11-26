// Renderer - Core rendering engine for Cosy Harvest: Pelican Hollow

import { GAME_CONFIG, hexToRgba, lerp, clamp } from '../constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    this.scale = GAME_CONFIG.RENDER_SCALE;
    this.initializeCanvas();
    this.initializeTileCache();
  }

  initializeCanvas() {
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.imageRendering = 'crisp-edges';
  }

  initializeTileCache() {
    this.tileCache = new Map();
    this.spriteSheets = new Map();
    this.rainDrops = [];
    this.windAngle = 0;
    this.windSpeed = 0;
    this.lightSources = [];
    this.ambientLight = 1;
    this.nightMode = false;
    this.particles = [];
    this.showDebug = false;
    this.showHitboxes = false;
    this.showGrid = false;
    this.weatherType = 'clear';
    this.weatherIntensity = 0;
    this.timeOfDay = 'morning';
    this.timeOverlayAlpha = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraTargetX = 0;
    this.cameraTargetY = 0;
    this.cameraZoom = 1;
    this.cameraTargetZoom = 1;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  setCameraTarget(x, y) {
    this.cameraTargetX = x - this.width / (2 * this.scale * this.cameraZoom);
    this.cameraTargetY = y - this.height / (2 * this.scale * this.cameraZoom);
  }

  setCameraZoom(zoom) {
    this.cameraTargetZoom = clamp(zoom, GAME_CONFIG.MIN_ZOOM, GAME_CONFIG.MAX_ZOOM);
  }

  updateCamera(dt) {
    const lerpFactor = 1 - Math.pow(1 - GAME_CONFIG.CAMERA_LERP, dt * 60);
    this.cameraX = lerp(this.cameraX, this.cameraTargetX, lerpFactor);
    this.cameraY = lerp(this.cameraY, this.cameraTargetY, lerpFactor);
    this.cameraZoom = lerp(this.cameraZoom, this.cameraTargetZoom, lerpFactor);
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.cameraX) * this.scale * this.cameraZoom,
      y: (worldY - this.cameraY) * this.scale * this.cameraZoom
    };
  }

  screenToWorld(screenX, screenY) {
    return {
      x: screenX / (this.scale * this.cameraZoom) + this.cameraX,
      y: screenY / (this.scale * this.cameraZoom) + this.cameraY
    };
  }

  loadSpriteSheet(name, url, frameWidth, frameHeight) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sheet = { image: img, frameWidth, frameHeight, animations: new Map() };
        this.spriteSheets.set(name, sheet);
        resolve(sheet);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  createSpriteSheetFromCanvas(name, canvas, frameWidth, frameHeight) {
    const sheet = { image: canvas, frameWidth, frameHeight, animations: new Map() };
    this.spriteSheets.set(name, sheet);
    return sheet;
  }

  defineAnimation(sheetName, animName, frames, frameDuration, loop = true) {
    const sheet = this.spriteSheets.get(sheetName);
    if (!sheet) return;
    sheet.animations.set(animName, { frames, frameDuration, loop });
  }

  getAnimation(sheetName, animName) {
    return this.spriteSheets.get(sheetName)?.animations.get(animName);
  }

  getOrCreateTileCanvas(type) {
    if (this.tileCache.has(type)) return this.tileCache.get(type);
    const size = GAME_CONFIG.TILE_SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    this.drawTile(ctx, type, 0, 0, size, size);
    this.tileCache.set(type, canvas);
    return canvas;
  }

  drawTile(ctx, type, x, y, w, h) {
    const colors = GAME_CONFIG.COLORS;
    const s = w / 16;

    switch (type) {
      case 'grass': {
        ctx.fillStyle = colors.GRASS_DARK;
        ctx.fillRect(x, y, w, h);
        for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 4; gx++) if ((gx + gy) % 2 === 0) {
          ctx.fillStyle = colors.GRASS_LIGHT;
          ctx.fillRect(x + gx * 4 * s, y + gy * 4 * s, 4 * s, 4 * s);
        }
        ctx.fillStyle = colors.GRASS_LIGHT;
        for (let i = 0; i < 8; i++) ctx.fillRect(x + (i * 2 + (i % 2)) * s, y + h - 3 * s, s, 3 * s);
        break;
      }
      case 'grass_flower': {
        this.drawTile(ctx, 'grass', x, y, w, h);
        const fx = x + 6 * s, fy = y + 4 * s;
        ctx.fillStyle = colors.FLOWER_PETAL;
        ctx.fillRect(fx, fy, 2 * s, 2 * s);
        ctx.fillRect(fx + 3 * s, fy, 2 * s, 2 * s);
        ctx.fillRect(fx, fy + 3 * s, 2 * s, 2 * s);
        ctx.fillRect(fx + 3 * s, fy + 3 * s, 2 * s, 2 * s);
        ctx.fillStyle = colors.FLOWER_CENTER;
        ctx.fillRect(fx + 2 * s, fy + 2 * s, 2 * s, 2 * s);
        break;
      }
      case 'dirt': {
        ctx.fillStyle = colors.SOIL_DRY;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#4a2f1a';
        for (let i = 0; i < 12; i++) ctx.fillRect(x + (i * 1.3 * s) % w, y + (i * 2.1 * s) % h, s, s);
        break;
      }
      case 'tilled_dry':
      case 'tilled_moist':
      case 'tilled_rich':
      case 'tilled_compacted': {
        let bc = colors.SOIL_DRY, fc = colors.FURROW;
        if (type === 'tilled_moist') { bc = colors.SOIL_MOIST; fc = '#2a1a0d'; }
        else if (type === 'tilled_rich') { bc = colors.SOIL_RICH; fc = '#1a0f08'; }
        else if (type === 'tilled_compacted') { bc = colors.SOIL_COMPACTED; fc = '#5a4a3a'; }
        ctx.fillStyle = bc; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = fc;
        for (let i = 0; i < 3; i++) ctx.fillRect(x, y + h * (0.2 + i * 0.25), w, 2 * s);
        if (type === 'tilled_rich') { ctx.fillStyle = '#3a2515'; for (let i = 0; i < 20; i++) ctx.fillRect(x + (i * 7) % w, y + (i * 11) % h, s, s); }
        if (type === 'tilled_compacted') { ctx.fillStyle = '#5a4a3a'; for (let i = 0; i < 8; i++) ctx.fillRect(x + (i * 2.5 * s) % w, y, s, h); }
        break;
      }
      case 'water':
      case 'water_ripple': {
        ctx.fillStyle = colors.WATER_DEEP; ctx.fillRect(x, y, w, h);
        if (type === 'water_ripple') { ctx.fillStyle = colors.WATER_RIPPLE; for (let i = 0; i < 3; i++) ctx.fillRect(x, y + h * (0.2 + i * 0.3), w, s); }
        break;
      }
      case 'stone': {
        ctx.fillStyle = '#555555'; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#444444';
        for (let i = 0; i < 10; i++) ctx.fillRect(x + (i * 1.6 * s) % w, y + (i * 1.3 * s) % h, 2 * s, 2 * s);
        break;
      }
      case 'stepping_stone': {
        ctx.fillStyle = colors.STEPPING_STONE; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = colors.STEPPING_STONE_DARK; ctx.fillRect(x + s, y + s, w - 2 * s, h - 2 * s);
        ctx.fillStyle = colors.STEPPING_STONE; ctx.fillRect(x + 2 * s, y + 2 * s, w - 4 * s, h - 4 * s);
        break;
      }
      case 'log_cabin_floor': {
        ctx.fillStyle = '#8b6b4a'; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#7a5a3a'; for (let i = 0; i < 4; i++) ctx.fillRect(x, y + i * 4 * s, w, s);
        break;
      }
      case 'log_cabin_wall': {
        for (let i = 0; i < 4; i++) {
          const ly = y + i * 4 * s;
          ctx.fillStyle = i % 2 === 0 ? GAME_CONFIG.COLORS.LOG_LIGHT : GAME_CONFIG.COLORS.LOG_DARK;
          ctx.fillRect(x, ly, w, 4 * s);
          ctx.fillStyle = GAME_CONFIG.COLORS.LOG_DARK; ctx.fillRect(x, ly + 3 * s, w, s);
        }
        break;
      }
      case 'chimney': {
        for (let by = 0; by < 4; by++) for (let bx = 0; bx < 4; bx++) {
          const offset = (by % 2) * 2 * s;
          ctx.fillStyle = colors.CHIMNEY_BRICK; ctx.fillRect(x + bx * 4 * s + offset, y + by * 4 * s, 4 * s, 4 * s);
          ctx.fillStyle = '#4a2a1f'; ctx.fillRect(x + bx * 4 * s + offset + 3 * s, y + by * 4 * s, s, 4 * s); ctx.fillRect(x + bx * 4 * s + offset, y + by * 4 * s + 3 * s, 4 * s, s);
        }
        break;
      }
      case 'window': {
        ctx.fillStyle = GAME_CONFIG.COLORS.LOG_DARK; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = colors.WINDOW_GLOW;
        for (let py = 0; py < 2; py++) for (let px = 0; px < 2; px++) ctx.fillRect(x + 2 * s + px * 5 * s, y + 2 * s + py * 5 * s, 4 * s, 4 * s);
        ctx.fillStyle = GAME_CONFIG.COLORS.LOG_DARK; ctx.fillRect(x + 6 * s, y, s, h); ctx.fillRect(x, y + 6 * s, w, s);
        break;
      }
      case 'door_closed': {
        ctx.fillStyle = colors.DOOR_WOOD; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#4a2a1a'; ctx.fillRect(x + 2 * s, y + 2 * s, w - 4 * s, h * 0.4); ctx.fillRect(x + 2 * s, y + h * 0.6, w - 4 * s, h * 0.35);
        ctx.fillStyle = colors.BRASS_KNOB; ctx.fillRect(x + w - 3 * s, y + h * 0.55, 2 * s, 2 * s);
        break;
      }
      case 'door_open': {
        ctx.fillStyle = GAME_CONFIG.COLORS.LOG_DARK; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = colors.DOOR_WOOD; ctx.fillRect(x, y, 3 * s, h);
        break;
      }
      case 'concrete': {
        ctx.fillStyle = colors.CONCRETE_PAD; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#6a6a6a'; for (let i = 0; i < 4; i++) ctx.fillRect(x + (i * 4.5 * s) % w, y, s, h);
        break;
      }
      case 'wooden_plank': {
        ctx.fillStyle = colors.JETTY_WOOD; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#5a4a3a'; for (let i = 0; i < 4; i++) ctx.fillRect(x, y + i * 4 * s, w, s);
        break;
      }
      case 'fence_post': {
        ctx.fillStyle = '#5a3a2a'; ctx.fillRect(x + 5 * s, y + 2 * s, 6 * s, h - 2 * s);
        ctx.fillStyle = '#4a2a1a'; ctx.fillRect(x + 5 * s, y, 6 * s, 3 * s);
        break;
      }
      case 'fence_wire': {
        ctx.strokeStyle = '#888888'; ctx.lineWidth = s;
        for (let i = 0; i < 3; i++) { const wy = y + h * (0.2 + i * 0.3); ctx.beginPath(); ctx.moveTo(x, wy); ctx.lineTo(x + w, wy); ctx.stroke(); }
        break;
      }
      case 'gate_closed': {
        ctx.fillStyle = '#5a3a2a'; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#4a2a1a'; for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 4 * s, y, 2 * s, h);
        break;
      }
      case 'gate_open': { this.drawTile(ctx, 'fence_post', x, y, w, h); break; }
    }
  }

  drawTileAt(type, worldX, worldY) {
    const p = this.worldToScreen(worldX * GAME_CONFIG.TILE_SIZE, worldY * GAME_CONFIG.TILE_SIZE);
    const cv = this.getOrCreateTileCanvas(type);
    this.ctx.drawImage(cv, p.x, p.y, GAME_CONFIG.TILE_SIZE * this.scale * this.cameraZoom, GAME_CONFIG.TILE_SIZE * this.scale * this.cameraZoom);
  }

  drawSprite(sheetName, frame, worldX, worldY, options = {}) {
    const sheet = this.spriteSheets.get(sheetName);
    if (!sheet) return;
    const { scale = 1, rotation = 0, alpha = 1, flipX = false, flipY = false, origin = { x: 0.5, y: 1.0 }, tint } = options;
    const p = this.worldToScreen(worldX, worldY);
    const dw = frame.width * this.scale * this.cameraZoom * scale;
    const dh = frame.height * this.scale * this.cameraZoom * scale;
    const ox = dw * origin.x, oy = dh * origin.y;
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.translate(p.x, p.y);
    if (rotation !== 0) this.ctx.rotate(rotation);
    if (flipX || flipY) this.ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    if (tint) {
      const tc = document.createElement('canvas'); tc.width = frame.width; tc.height = frame.height;
      const tx = tc.getContext('2d'); tx.drawImage(sheet.image, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);
      tx.globalCompositeOperation = 'source-in'; tx.fillStyle = `rgb(${tint.r},${tint.g},${tint.b})`; tx.fillRect(0, 0, frame.width, frame.height);
      this.ctx.drawImage(tc, -ox, -oy, dw, dh);
    } else this.ctx.drawImage(sheet.image, frame.x, frame.y, frame.width, frame.height, -ox, -oy, dw, dh);
    this.ctx.restore();
  }

  drawAnimatedSprite(sheetName, animName, animTime, worldX, worldY, direction, options = {}) {
    const anim = this.getAnimation(sheetName, animName);
    if (!anim) return;
    const fi = Math.floor(animTime / anim.frameDuration) % anim.frames.length;
    this.drawSprite(sheetName, anim.frames[fi], worldX, worldY, options);
  }

  drawRect(x, y, w, h, color, screenSpace = true) { this.ctx.fillStyle = color; if (screenSpace) this.ctx.fillRect(x, y, w, h); else { const p = this.worldToScreen(x, y); this.ctx.fillRect(p.x, p.y, w * this.scale * this.cameraZoom, h * this.scale * this.cameraZoom); } }
  drawRectOutline(x, y, w, h, color, thickness = 1, screenSpace = true) { this.ctx.strokeStyle = color; this.ctx.lineWidth = thickness; if (screenSpace) this.ctx.strokeRect(x, y, w, h); else { const p = this.worldToScreen(x, y); this.ctx.strokeRect(p.x, p.y, w * this.scale * this.cameraZoom, h * this.scale * this.cameraZoom); } }
  drawText(text, x, y, options = {}) { const { font = '10px "Courier New", monospace', color = GAME_CONFIG.COLORS.HUD_TEXT, align = 'left', baseline = 'top', maxWidth, screenSpace = true, shadow = false } = options; this.ctx.font = font; this.ctx.fillStyle = color; this.ctx.textAlign = align; this.ctx.textBaseline = baseline; if (shadow) { this.ctx.fillStyle = '#000'; if (screenSpace) this.ctx.fillText(text, x + 1, y + 1, maxWidth); else { const p = this.worldToScreen(x, y); this.ctx.fillText(text, p.x + 1, p.y + 1, maxWidth); } this.ctx.fillStyle = color; } if (screenSpace) this.ctx.fillText(text, x, y, maxWidth); else { const p = this.worldToScreen(x, y); this.ctx.fillText(text, p.x, p.y, maxWidth); } }
  drawPanel(x, y, w, h, options = {}) { const { bgColor = GAME_CONFIG.COLORS.HUD_BG, borderColor = GAME_CONFIG.COLORS.HUD_BORDER, borderWidth = 2, radius = 0 } = options; this.ctx.fillStyle = bgColor; this.ctx.strokeStyle = borderColor; this.ctx.lineWidth = borderWidth; if (radius > 0) { this.roundRect(x, y, w, h, radius); this.ctx.fill(); this.ctx.stroke(); } else { this.ctx.fillRect(x, y, w, h); this.ctx.strokeRect(x, y, w, h); } }
  roundRect(x, y, w, h, r) { this.ctx.beginPath(); this.ctx.moveTo(x + r, y); this.ctx.lineTo(x + w - r, y); this.ctx.quadraticCurveTo(x + w, y, x + w, y + r); this.ctx.lineTo(x + w, y + h - r); this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); this.ctx.lineTo(x + r, y + h); this.ctx.quadraticCurveTo(x, y + h, x, y + h - r); this.ctx.lineTo(x, y + r); this.ctx.quadraticCurveTo(x, y, x + r, y); this.ctx.closePath(); }

  setWeather(type, intensity) { this.weatherType = type; this.weatherIntensity = clamp(intensity, 0, 1); this.updateRainDrops(); }
  updateRainDrops() { if (this.weatherType === 'rain' || this.weatherType === 'storm') { const n = Math.floor(200 * this.weatherIntensity); this.rainDrops = []; for (let i = 0; i < n; i++) this.rainDrops.push({ x: Math.random() * this.width, y: Math.random() * this.height, len: 10 + Math.random() * 20, spd: 400 + Math.random() * 200, ang: Math.PI / 6 + (Math.random() - 0.5) * 0.3 }); } else this.rainDrops = []; }
  updateWeather(dt) { for (const d of this.rainDrops) { d.y += d.spd * dt; d.x += Math.tan(d.ang) * d.spd * dt; if (d.y > this.height + 50) { d.y = -50; d.x = Math.random() * this.width; } } this.windAngle += dt * 0.5 * this.windSpeed; this.windSpeed = clamp(this.windSpeed + (Math.random() - 0.5) * 0.1 * dt, 0, 2); }
  renderWeather() { if (this.weatherType === 'rain' || this.weatherType === 'storm') { this.ctx.strokeStyle = GAME_CONFIG.COLORS.RAIN_COLOR; this.ctx.lineWidth = 1; this.ctx.lineCap = 'round'; for (const d of this.rainDrops) { this.ctx.beginPath(); this.ctx.moveTo(d.x, d.y); this.ctx.lineTo(d.x - Math.sin(d.ang) * d.len, d.y - Math.cos(d.ang) * d.len); this.ctx.stroke(); } if (this.weatherType === 'storm') { this.ctx.fillStyle = 'rgba(186, 230, 253, 0.3)'; for (let i = 0; i < 30; i++) { const sx = Math.random() * this.width, sy = this.height * 0.6 + Math.random() * this.height * 0.4; this.ctx.fillRect(sx, sy, 2, 1); } } } else if (this.weatherType === 'fog') { const a = 0.3 * this.weatherIntensity, g = this.ctx.createLinearGradient(0, 0, 0, this.height); g.addColorStop(0, `rgba(180, 190, 200, ${a * 0.5})`); g.addColorStop(0.5, `rgba(180, 190, 200, ${a})`); g.addColorStop(1, `rgba(180, 190, 200, ${a * 0.5})`); this.ctx.fillStyle = g; this.ctx.fillRect(0, 0, this.width, this.height); } }
  setTimeOfDay(time, hour, minute) { this.timeOfDay = time; this.calculateTimeOverlay(hour, minute); }
  calculateTimeOverlay(h, m) { const tm = h + m / 60; if (tm >= 5 && tm < 7) { this.timeOverlayAlpha = lerp(0.4, 0, (tm - 5) / 2); this.nightMode = false; } else if (tm >= 7 && tm < 17) { this.timeOverlayAlpha = 0; this.nightMode = false; } else if (tm >= 17 && tm < 19) { this.timeOverlayAlpha = lerp(0, 0.4, (tm - 17) / 2); this.nightMode = false; } else if (tm >= 19 && tm < 22) { this.timeOverlayAlpha = 0.4; this.nightMode = true; } else if (tm >= 22 || tm < 3) { this.timeOverlayAlpha = 0.6; this.nightMode = true; } else { this.timeOverlayAlpha = 0.7; this.nightMode = true; } this.ambientLight = 1 - this.timeOverlayAlpha * 0.5; }
  renderTimeOverlay() { if (this.timeOverlayAlpha <= 0) return; let c; switch (this.timeOfDay) { case 'dawn': c = GAME_CONFIG.COLORS.DAWN_OVERLAY; break; case 'evening': c = GAME_CONFIG.COLORS.SUNSET_OVERLAY; break; case 'night': c = GAME_CONFIG.COLORS.NIGHT_OVERLAY; break; case 'midnight': c = GAME_CONFIG.COLORS.MIDNIGHT_OVERLAY; break; default: return; } this.ctx.fillStyle = c.replace(/[\d.]+\)$/, this.timeOverlayAlpha + ')'); this.ctx.fillRect(0, 0, this.width, this.height); }
  addLightSource(l) { this.lightSources.push(l); } clearLightSources() { this.lightSources = []; }
  renderLights() { if (!this.lightSources.length) return; const lc = document.createElement('canvas'); lc.width = this.width; lc.height = this.height; const lx = lc.getContext('2d'); lx.fillStyle = `rgba(0, 0, 0, ${1 - this.ambientLight})`; lx.fillRect(0, 0, this.width, this.height); lx.globalCompositeOperation = 'lighter'; for (const l of this.lightSources) { const g = lx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); g.addColorStop(0, `rgba(${l.c.r},${l.c.g},${l.c.b},${l.i})`); g.addColorStop(1, `rgba(${l.c.r},${l.c.g},${l.c.b},0)`); lx.fillStyle = g; lx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); } this.ctx.globalCompositeOperation = 'multiply'; this.ctx.drawImage(lc, 0, 0); this.ctx.globalCompositeOperation = 'source-over'; }
  addParticle(p) { this.particles.push(p); }
  updateParticles(dt) { for (let i = this.particles.length - 1; i >= 0; i--) { const p = this.particles[i]; p.l -= dt; if (p.l <= 0) { this.particles.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= p.d; p.vy *= p.d; p.vy += p.g * dt; p.a = p.l / p.ml; p.s = p.ss * p.l / p.ml; } }
  renderParticles() { for (const p of this.particles) { this.ctx.globalAlpha = p.a; this.ctx.fillStyle = p.c; const p2 = this.worldToScreen(p.x, p.y); this.ctx.fillRect(p2.x - p.s / 2, p2.y - p.s / 2, p.s, p.s); } this.ctx.globalAlpha = 1; }
  toggleDebug() { this.showDebug = !this.showDebug; } toggleHitboxes() { this.showHitboxes = !this.showHitboxes; } toggleGrid() { this.showGrid = !this.showGrid; }
  renderDebug(playerPos, tileMap) { if (!this.showDebug) return; if (this.showGrid) { this.ctx.strokeStyle = 'rgba(255,255,255,0.1)'; this.ctx.lineWidth = 1; const ts = GAME_CONFIG.TILE_SIZE * this.scale * this.cameraZoom, sx = -this.cameraX * this.scale * this.cameraZoom, sy = -this.cameraY * this.scale * this.cameraZoom; for (let x = 0; x < this.width / ts + 1; x++) { this.ctx.beginPath(); this.ctx.moveTo(sx + x * ts, 0); this.ctx.lineTo(sx + x * ts, this.height); this.ctx.stroke(); } for (let y = 0; y < this.height / ts + 1; y++) { this.ctx.beginPath(); this.ctx.moveTo(0, sy + y * ts); this.ctx.lineTo(this.width, sy + y * ts); this.ctx.stroke(); } } this.ctx.fillStyle = '#f00'; const ps = this.worldToScreen(playerPos.x, playerPos.y); this.ctx.fillRect(ps.x - 2, ps.y - 2, 4, 4); this.drawText(`(${playerPos.x.toFixed(1)},${playerPos.y.toFixed(1)})`, ps.x + 10, ps.y - 10, { font: '8px monospace', color: '#f00' }); }
  beginFrame() { this.ctx.fillStyle = '#0d0d1a'; this.ctx.fillRect(0, 0, this.width, this.height); } endFrame() {}
  getCX() { return this.cameraX; } getCY() { return this.cameraY; } getCZ() { return this.cameraZoom; } getCV() { return this.canvas; } getCTX() { return this.ctx; } getW() { return this.width; } getH() { return this.height; } getS() { return this.scale; }
}