// Core type definitions for Cosy Harvest: Pelican Hollow (as runtime constants)

export const Direction = {
  DOWN: 'down', UP: 'up', LEFT: 'left', RIGHT: 'right'
};

export const TileType = {
  GRASS: 'grass', GRASS_FLOWER: 'grass_flower', DIRT: 'dirt',
  TILLED_DRY: 'tilled_dry', TILLED_MOIST: 'tilled_moist', TILLED_RICH: 'tilled_rich', TILLED_COMPACTED: 'tilled_compacted',
  WATER: 'water', WATER_RIPPLE: 'water_ripple', STONE: 'stone',
  STEPPING_STONE: 'stepping_stone', LOG_CABIN_FLOOR: 'log_cabin_floor', LOG_CABIN_WALL: 'log_cabin_wall',
  CHIMNEY: 'chimney', WINDOW: 'window', DOOR_CLOSED: 'door_closed', DOOR_OPEN: 'door_open',
  CONCRETE: 'concrete', WOODEN_PLANK: 'wooden_plank', FENCE_POST: 'fence_post',
  FENCE_WIRE: 'fence_wire', GATE_CLOSED: 'gate_closed', GATE_OPEN: 'gate_open'
};

export const WeatherType = { CLEAR: 'clear', CLOUDY: 'cloudy', RAIN: 'rain', STORM: 'storm', FOG: 'fog' };
export const TimeOfDay = { DAWN: 'dawn', MORNING: 'morning', NOON: 'noon', AFTERNOON: 'afternoon', EVENING: 'evening', NIGHT: 'night', MIDNIGHT: 'midnight' };

export const VehicleType = {
  UTE_1984: 'ute_1984', TRUCK_1992: 'truck_1992',
  TRACTOR_VINTAGE_45HP: 'tractor_vintage_45hp', TRACTOR_ROWCROP_140HP: 'tractor_rowcrop_140hp',
  COMBINE_HARVESTER: 'combine_harvester', LOADER_ARTICULATED: 'loader_articulated',
  TRAILER_LIVESTOCK: 'trailer_livestock', TRAILER_FUEL: 'trailer_fuel', TRAILER_FLATBED: 'trailer_flatbed'
};

export const ImplementType = {
  PLOUGH_3FURROW: 'plough_3furrow', DISCS_OFFSET: 'discs_offset', AIR_SEEDER: 'air_seeder',
  BOOM_SPRAYER: 'boom_sprayer', LOADER_BUCKET: 'loader_bucket', PALLET_FORKS: 'pallet_forks',
  BALE_SPIKE: 'bale_spike', MOWER_CONDITIONER: 'mower_conditioner', ROUND_BALER: 'round_baler',
  GRAIN_HEADER: 'grain_header', CORN_HEADER: 'corn_header', ROOT_HEADER: 'root_header',
  DEEP_RIPPER: 'deep_ripper', SUBSOILER: 'subsoiler'
};

export const CattleBreed = { ANGUS: 'angus', HEREFORD: 'hereford', WAGYU_TAJIMA: 'wagyu_tajima', BRAHMAN: 'brahman', SANTA_GERTRUDIS: 'santa_gertrudis' };
export const CattleSex = { BULL: 'bull', HEIFER: 'heifer', STEER: 'steer', COW: 'cow', CALF: 'calf' };
export const PregnancyStatus = { OPEN: 'open', BRED: 'bred', CONFIRMED: 'confirmed', CALVING_SOON: 'calving_soon' };
export const EarTagColor = { GREEN: 'green', RED: 'red', YELLOW: 'yellow', BLUE: 'blue', NONE: 'none' };

export const Certification = { MANUAL: 'manual_labour', HEAVY: 'heavy_machinery', STOCKMAN: 'stockman', IRRIGATION: 'irrigation_mechanical' };
export const PersonalityTrait = { EARLY_RISER: 'early_riser', METICULOUS: 'meticulous_mechanic', GENTLE: 'gentle_stockhandler', LEAD_FOOT: 'lead_foot_driver', CHATTY: 'chatty', PERFECTIONIST: 'perfectionist', LAID_BACK: 'laid_back' };

export const TaskType = { CULTIVATE: 'cultivate', SEED: 'seed', FERTILIZE: 'fertilize', SPRAY: 'spray', HARVEST: 'harvest', MOW: 'mow', BALE: 'bale', LOAD: 'load', TRANSPORT: 'transport', MUSTER: 'muster', PREG_TEST: 'preg_test', FEED_CATTLE: 'feed_cattle', WATER_CATTLE: 'water_cattle', REPAIR_FENCE: 'repair_fence', REPAIR_PIPE: 'repair_pipe', MAINTAIN_VEHICLE: 'maintain_vehicle', FORAGE_TRUFFLE: 'forage_truffle', HAND_HARVEST: 'hand_harvest', WEED: 'weed' };

export const FenceType = { BARBED: 'barbed', ELECTRIC: 'electric', POST_RAIL: 'post_rail', NONE: 'none' };
export const SoilType = { ALLUVIAL: 'alluvial_loam', BRIGALOW: 'brigalow_clay', RED: 'red_soil', FOREST: 'forest_loam', SANDY: 'sandy_loam' };
export const BuildingType = { FARMHOUSE: 'farmhouse', MACHINERY_SHED: 'machinery_shed', HAY_SHED: 'hay_shed', BUNKHOUSE: 'bunkhouse', CATTLE_CRUSH: 'cattle_crush', COLD_ROOM: 'cold_room', GREENHOUSE: 'greenhouse', WORKSHOP: 'workshop', SILO: 'silo', DIESEL_TANK: 'diesel_tank', RAINWATER_TANK: 'rainwater_tank', FARM_DAM: 'farm_dam', CREEK_PUMP: 'creek_pump', STOCK_TROUGH: 'stock_trough' };
export const MinigameType = { PIPE_SEALANT: 'pipe_sealant', ANGLING_BOBBER: 'angling_bobber', ANGLING_REEL: 'angling_reel', FLANGE_TORQUE: 'flange_torque', ULTRASOUND: 'ultrasound_scan', PTO_ALIGNMENT: 'pto_alignment', DIESEL_BLEED: 'diesel_bleed', SEED_GRADING: 'seed_grading', SOIL_TEST: 'soil_test', MICROSCOPE: 'microscope', ENGINE_OVERHAUL: 'engine_overhaul', FENCE_STRAINER: 'fence_strainer', PIPE_COUPLING: 'pipe_coupling' };

export const ItemType = { TOOL: 'tool', SEED: 'seed', PRODUCE: 'produce', MATERIAL: 'material', FURNITURE: 'furniture', MACHINE: 'machine', LIVESTOCK: 'livestock', BAIT: 'bait', CONSUMABLE: 'consumable' };
export const PanelType = { DIRECTORY: 'directory', NOTEBOOK: 'notebook', COMPUTER: 'computer', MAP: 'map', INVENTORY: 'inventory', CRAFTING: 'crafting', SHOP: 'shop', EMPLOYEE: 'employee', VEHICLE: 'vehicle', CATTLE: 'cattle', PADDOCK: 'paddock' };
export const NotificationType = { INFO: 'info', WARNING: 'warning', SUCCESS: 'success', ERROR: 'error', QUEST: 'quest', MAIL: 'mail', BILL: 'bill' };
export const QuestType = { COLLECT: 'collect', BUILD: 'build', REACH: 'reach', SELL: 'sell', HIRE: 'hire', BREED: 'breed', DISCOVER: 'discover' };
export const RewardType = { MONEY: 'money', ITEM: 'item', RECIPE: 'recipe', BLUEPRINT: 'blueprint', LAND: 'land', REPUTATION: 'reputation' };