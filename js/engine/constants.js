// Game constants and configuration for Cosy Harvest: Pelican Hollow

export const GAME_CONFIG = {
  // Rendering
  TILE_SIZE: 16,
  CHUNK_SIZE: 64,
  VIEWPORT_WIDTH: 1024,
  VIEWPORT_HEIGHT: 768,
  RENDER_SCALE: 3,
  MAX_ZOOM: 4,
  MIN_ZOOM: 1,

  // Time
  BASE_TIME_SCALE: 1,
  DAY_LENGTH_MINUTES: 24 * 60,
  SEASON_LENGTH_DAYS: 28,

  // Player
  PLAYER_SPEED: 1.5,
  PLAYER_RUN_MULTIPLIER: 1.8,
  PLAYER_STAMINA_DRAIN: 5,
  PLAYER_STAMINA_REGEN: 2,
  PLAYER_MAX_STAMINA: 100,

  // World
  STARTING_MONEY: 280,
  STARTING_POSITION: { x: 30, y: 22 },
  HOMESTEAD_BOUNDS: { x: 0, y: 0, width: 60, height: 44 },

  // Physics
  GRAVITY: 0,
  FRICTION: 0.85,

  // Camera
  CAMERA_LERP: 0.1,
  CAMERA_DEADZONE: 0.15,

  // Weather
  WEATHER_CHANGE_CHANCE: 0.15,
  RAIN_DURATION_HOURS: { min: 2, max: 8 },

  // Crops
  MAX_CROP_HEALTH: 100,
  DISEASE_SPREAD_CHANCE: 0.02,
  WEED_GROWTH_CHANCE: 0.05,

  // Soil
  SOIL_MAX_NUTRIENT: 100,
  SOIL_MIN_PH: 4.5,
  SOIL_MAX_PH: 8.0,
  COMPACTION_PER_TRACTOR_PASS: 2,
  COMPACTION_RECOVERY_PER_DAY: 0.5,

  // Cattle
  CATTLE_MAX_HEALTH: 100,
  CATTLE_GESTATION_DAYS: 283,
  CATTLE_WEANING_AGE_DAYS: 210,
  PASTURE_REGROWTH_RATE: 5,
  OVERGRAZING_THRESHOLD: 800,

  // Vehicles
  VEHICLE_FUEL_CONSUMPTION_BASE: 0.5,
  VEHICLE_OVERHEAT_THRESHOLD: 110,
  VEHICLE_MAX_ENGINE_TEMP: 130,

  // Employees
  EMPLOYEE_MAX_FATIGUE: 100,
  EMPLOYEE_FATIGUE_PER_HOUR: 5,
  EMPLOYEE_MORALE_DECAY: 1,
  EMPLOYEE_PAYDAY_INTERVAL_DAYS: 14,

  // Economy
  MARKET_PREMIUM_SATURDAY: 1.35,
  MARKET_COMMISSION: 0.05,
  BANK_INTEREST_RATE: 0.03,

  // Utilities
  ELECTRICITY_RATE_PER_KWH: 0.28,
  WATER_RATE_PER_KL: 2.10,
  DIESEL_RATE_PER_LITRE: 1.85,
  BULK_DIESEL_DISCOUNT: 0.15,

  // Minigames
  MINIGAME_PIPE_SEALANT_WINDOW: 0.3,
  MINIGAME_FLANGE_TORQUE_WINDOW: 0.25,
  MINIGAME_ULTRASOUND_WINDOW: 0.2,
  MINIGAME_PTO_ALIGNMENT_WINDOW: 0.15,
  MINIGAME_ANGLING_BITE_WINDOW: 1.5,
  MINIGAME_ANGLING_REEL_SPEED: 0.5,

  // UI
  HOTBAR_SLOTS: 8,
  INVENTORY_ROWS: 4,
  INVENTORY_COLS: 10,
  NOTIFICATION_DURATION: 5000,
  DIALOGUE_TEXT_SPEED: 30,

  // Colors
  COLORS: {
    GRASS_DARK: '#3d612c', GRASS_LIGHT: '#466d33', FLOWER_PETAL: '#fef08a', FLOWER_CENTER: '#f97316',
    SOIL_DRY: '#573620', SOIL_MOIST: '#3b2213', SOIL_RICH: '#261710', SOIL_COMPACTED: '#7a6a5a', FURROW: '#26150b',
    WATER_DEEP: '#2b5b84', WATER_RIPPLE: '#477ca8', WATER_SHALLOW: '#3d7ab8',
    ROOF_DARK: '#4a2511', ROOF_LIGHT: '#5c2f16', LOG_DARK: '#633b1f', LOG_LIGHT: '#7c4d2b',
    STONE_FOUNDATION: '#5a5a5a', CHIMNEY_BRICK: '#8b3e2f', WINDOW_GLOW: '#fde047',
    DOOR_WOOD: '#5d3a1a', BRASS_KNOB: '#cd953c',
    STEPPING_STONE: '#9c7a54', STEPPING_STONE_DARK: '#73573b',
    CREEK_PUMP: '#1e5b53', CONCRETE_PAD: '#7a7a7a', JETTY_WOOD: '#8b6b4a',
    HUD_BG: '#2d1f1a', HUD_BORDER: '#7c4d2b', HUD_TEXT: '#f5e6d3', HUD_ACCENT: '#fde047',
    STAMINA_GREEN: '#466d33', STAMINA_YELLOW: '#fde047', STAMINA_RED: '#dc2626',
    INTERACTION_PROMPT_BG: '#1a1a1a', INTERACTION_PROMPT_BORDER: '#cd953c', INTERACTION_PROMPT_TEXT: '#fde047',
    DIALOGUE_BG: '#1a120a', DIALOGUE_BORDER: '#7c4d2b', DIALOGUE_TEXT: '#f5e6d3',
    DIALOGUE_RESPONSE_BG: '#2d1f1a', DIALOGUE_RESPONSE_HOVER: '#3d2f1f', DIALOGUE_RESPONSE_TEXT: '#fde047',
    HOTBAR_BG: '#1a120a', HOTBAR_BORDER: '#7c4d2b', HOTBAR_SELECTED: '#fde047', HOTBAR_EMPTY: '#2d1f1a',
    RAIN_COLOR: 'rgba(186, 230, 253, 0.52)', FOG_COLOR: 'rgba(180, 190, 200, 0.4)',
    DAWN_OVERLAY: 'rgba(255, 180, 100, 0.3)', SUNSET_OVERLAY: 'rgba(255, 120, 60, 0.4)',
    NIGHT_OVERLAY: 'rgba(20, 30, 60, 0.6)', MIDNIGHT_OVERLAY: 'rgba(10, 15, 40, 0.7)',
    EXHAUST_SMOKE: 'rgba(60, 50, 40, 0.6)', HEADLIGHT_CONE: 'rgba(255, 245, 220, 0.3)',
    BEACON_ORANGE: '#ff6b00', BEACON_RED: '#dc2626',
    ANGUS_COAT: '#1a1a1a', ANGUS_HORN: '#fefef5', HEREFORD_RED: '#8b3e2f', HEREFORD_WHITE: '#fefef5',
    WAGYU_COAT: '#0a0a0a', BRAHMAN_GREY: '#6b6b6b', BRAHMAN_HUMP: '#5a5a5a', SANTA_RED: '#a04030', CALF_SCALE: 0.5,
    BERKSHIRE_PINK: '#e8a8b8', BERKSHIRE_BLACK: '#2a1a1a', BERKSHIRE_SICK: '#8a9a6a',
    DUST_COLOR: '#c9b896', SMOKE_COLOR: 'rgba(80, 70, 60, 0.5)', SPARK_COLOR: '#fde047', WATER_SPLASH: 'rgba(186, 230, 253, 0.8)'
  },

  // Z-Index Layers
  LAYERS: {
    GROUND: 0, GROUND_DECOR: 10, STRUCTURE_BASE: 20, CROPS: 30, ENTITIES: 40,
    VEHICLES: 50, VEHICLE_TOP: 55, STRUCTURE_TOP: 60, OVERLAY: 70, WEATHER: 80,
    UI_BACKGROUND: 100, UI_PANELS: 200, UI_DIALOGUE: 300, UI_MINIGAME: 400,
    UI_NOTIFICATIONS: 500, UI_TOOLTIPS: 600, UI_DEBUG: 1000
  },

  // Sprite sheet layout
  SPRITE_SHEET: { TILE_WIDTH: 16, TILE_HEIGHT: 16, CHARACTER_WIDTH: 24, CHARACTER_HEIGHT: 32, VEHICLE_TILE_WIDTH: 32, VEHICLE_TILE_HEIGHT: 32, BUILDING_TILE_WIDTH: 32, BUILDING_TILE_HEIGHT: 32 },

  // Audio
  AUDIO: { SAMPLE_RATE: 44100, MAX_CHANNELS: 32, FADE_TIME: 0.5 },

  // Save
  SAVE_VERSION: 1,
  AUTO_SAVE_INTERVAL: 300000,
  MAX_SAVE_SLOTS: 5
};

// Helper functions
export function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function lerp(a, b, t) { return a + (b - a) * t; }
export function lerpVec2(a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; }
export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
export function distance(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }

export function directionToVec2(dir) {
  switch (dir) {
    case 'down': return { x: 0, y: 1 };
    case 'up': return { x: 0, y: -1 };
    case 'left': return { x: -1, y: 0 };
    case 'right': return { x: 1, y: 0 };
  }
}

export function vec2ToDirection(vec) {
  if (Math.abs(vec.x) > Math.abs(vec.y)) return vec.x > 0 ? 'right' : 'left';
  return vec.y > 0 ? 'down' : 'up';
}

export function rotateVec2(vec, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: vec.x * cos - vec.y * sin, y: vec.x * sin + vec.y * cos };
}

export function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function randomFloat(min, max) { return Math.random() * (max - min) + min; }

export function seededRandom(seed) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
}

export function generateId(prefix = '') { return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`; }

export function formatTime(hour, minute, use12Hour = true) {
  if (use12Hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function formatDate(day, season, year) {
  const seasonNames = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return `${dayNames[(day - 1) % 7]}, ${day} ${seasonNames[season]} Year ${year}`;
}

export function formatMoney(amount) { return `$${amount.toLocaleString()}`; }
export function formatNumber(num, decimals = 0) { return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }