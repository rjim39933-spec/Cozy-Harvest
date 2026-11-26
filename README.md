# Cosy Harvest: Pelican Hollow

A hyper-realistic top-down farming, machinery, and pastoral simulation game built with TypeScript and HTML5 Canvas.

## Features

### Core Gameplay
- **Physical Interaction**: Walk to objects, pick them up, carry them, use them in the world
- **No Floating Menus**: Telephone requires physical directory, notebook pins to screen side, shop requires driving to town
- **Realistic Scale**: Relaxed time pace (1 game minute = 1 real second), generous crop yields, meaningful progression

### Visual Engine
- **100% Pixel Art**: Handcrafted 16×16, 24×24, 32×32 sprites - zero emojis
- **Cohesive Aesthetic**: Checkerboard meadow, log-cabin farmhouse, stepping-stone paths, western creek with jetty
- **Dynamic Weather**: Rain streaks, surface splashes, mud tracks, fog, day/night lighting transitions
- **4-Directional Models**: Characters, vehicles, and animals rotate smoothly with proper animations

### Farming & Agronomy
- **Full N-P-K Simulation**: Nitrogen, Phosphorus, Potassium, pH, organic matter, compaction per tile
- **Crop Rotation**: Legumes fix nitrogen, heavy feeders deplete soil
- **Realistic Growth**: 7-8 growth stages per crop with authentic durations
- **Pests & Diseases**: Aphids, mildew, root rot based on environmental triggers
- **Soil Testing**: Physical samples, microscope minigame, botanist consultations

### Machinery & Vehicles
- **Drivable Fleet**: 1984 Ute, 45HP Vintage Tractor, 140HP Row-Crop Tractor, Combine Harvester, Articulated Loader
- **3-Point Hitch & PTO**: Realistic implement coupling, hydraulic raise/lower, PTO engagement
- **Diesel Logistics**: On-farm bulk tank, fuel consumption by load, maintenance schedules
- **Mechanical Wear**: Engine temp, oil pressure, air filter, shear bolts, head gaskets

### Livestock & Genetics
- **Breed Variety**: Angus, Hereford, Wagyu, Brahman, Santa Gertrudis with distinct sprites
- **EBV Genetics**: Calving ease, 200-day growth, marbling (BMS), milk, fertility
- **Breeding System**: Natural service, gestation (283 days), calving, weaning
- **Pregnancy Testing**: Vet ultrasound ($25/hd) or DIY B-mode scanner minigame
- **Cattle Crush**: Batch preg-test, one-click cull open heifers, draft for sale/processing
- **Cold Room Processing**: Dry-aged beef boxes (Choice Hereford, Prime Angus, A5 Wagyu)

### Truffle System
- **Inoculated Truffières**: Plant French Oak/Hazelnut on limed soil
- **Active Pig AI**: Berkshire pigs pathfind to scent plumes, unearth truffles
- **Bond & Training**: Reward pigs, improve detection rate, manage health
- **Varieties**: Périgord Black ($145), Alba White ($310), Summer Black, Bianchetto

### Infinite World
- **Cadastral Survey**: 64×64 tile lots with lot/plan numbers, soil types, water access
- **Procedural Biomes**: Alluvial flats, brigalow scrub, red ridges, oak gullies
- **Land Market**: Buy freehold, negotiate, lease, auction bidding
- **Earthworks**: Clear timber, pull stumps, grade tracks, string fences

### Employees & HR
- **Persistent Characters**: Named workers with portraits, resumes, personalities
- **Certifications**: Manual labour, heavy machinery, stockman, irrigation/mechanical
- **Shift Rosters**: Bunkhouse quarters, morale, fatigue, fortnightly payroll
- **Task Delegation**: "Take tractor + plough to Paddock B", watch them drive and work

### Minigames (Themed & Contextual)
1. **Pipe Sealant** - Pressure bar timing (easy)
2. **Angling Bobber** - First-person POV strike timing (medium)
3. **Angling Reel** - Vertical tension bar battle (medium)
4. **Flange Torque** - 4-bolt criss-cross pattern (hard)
5. **B-Mode Ultrasound** - Fetal heartbeat detection (technical)
6. **PTO Alignment** - 6-spline shear pin engagement (mechanical)

### Infrastructure
- **Irrigation Network**: Creek pumps, bore pumps, rainwater tanks (22,500L-50,000L), farm dams (15-50ML), stock troughs, pipe network with leaks
- **Utility Bills**: Metered kWh electricity, kL water, bulk diesel delivery
- **Buildings**: Machinery shed, hay shed, bunkhouse, cattle crush, cold room, greenhouse, workshop, silo, diesel tank

## Technical Architecture

```
src/
├── engine/
│   ├── types.ts           # Core type definitions
│   ├── constants.ts       # Game constants, colors, helpers
│   ├── rendering/
│   │   └── Renderer.ts    # Canvas renderer, tiles, sprites, weather, lighting
│   ├── input/
│   │   └── InputManager.ts # Keyboard, mouse, gamepad, action mapping
│   ├── audio/
│   │   └── AudioManager.ts # Web Audio API, spatial sound, procedural SFX
│   └── utils/
│       ├── AssetLoader.ts  # Manifest loading, procedural asset generation
│       └── SaveManager.ts  # localStorage save/load, compression
├── game/
│   ├── systems/
│   │   ├── VehicleSystem.ts   # Physics, specs, hitching, PTO
│   │   ├── CattleSystem.ts    # Genetics, breeding, mustering, preg-test
│   │   ├── CropSystem.ts      # Growth, soil, diseases, harvest
│   │   ├── EmployeeSystem.ts  # HR, shifts, tasks, payroll
│   │   ├── IrrigationSystem.ts # Pumps, tanks, pipes, zones
│   │   └── TruffleSystem.ts   # Woods, inoculation, pig AI
│   ├── world/
│   │   └── WorldManager.ts    # Infinite chunks, cadastral map
│   ├── ui/
│   │   └── UISystem.ts        # Panels, split-screen, dialogue, HUD
│   └── minigames/
│       └── Minigames.ts       # All 6 themed minigames
└── main.ts                  # Game loop, initialization, integration
```

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## Controls

| Action | Key |
|--------|-----|
| Move | WASD / Arrow Keys |
| Run | Shift |
| Interact | E |
| Tool Use | Space |
| Tool Secondary | Q |
| Hotbar 1-8 | 1-8 |
| Inventory | I / Tab |
| Notebook | N |
| Map | M |
| Pause | Escape |
| Screenshot | F2 |
| Debug | F3 |

**In Vehicle:**
| Action | Key |
|--------|-----|
| Throttle/Brake | W / S |
| Steer | A / D |
| PTO Toggle | F |
| Hitch Raise/Lower | V |
| Headlights | H |
| Gear Up/Down | W / S (context) |
| Unload Auger | U |

## Save System

- 5 save slots + auto-save (slot 0)
- Auto-saves every 5 minutes
- Export/import JSON save files
- Version migration support

## Development Notes

### Pixel Art Pipeline
All sprites generated procedurally at runtime via `AssetLoader`:
- `generateCharacterSprites()` - 4-dir × 4-frame player
- `generateVehicleSprites()` - 8 vehicles × 4 directions
- `generateCattleSprites()` - 5 breeds × 5 ages × 4 dirs × 4 frames
- `generateUIAssets()` - HUD, hotbar, prompts, panels
- `generateTileAssets()` - 24 tile types with variants

### Adding New Content

**New Crop**: Add to `CROP_DEFINITIONS` in `CropSystem.ts`
**New Vehicle**: Add to `VEHICLE_SPECS` in `VehicleSystem.ts`
**New Breed**: Add to `BREED_STATS` in `CattleSystem.ts`
**New Minigame**: Extend `BaseMinigame` in `Minigames.ts`
**New Building**: Add to `BuildingType` in `types.ts`

### Performance Targets
- 60 FPS on 5-year-old hardware
- <100ms chunk generation
- <16ms frame time (60 FPS)
- Chunk streaming: 2-chunk radius around player

## License

Proprietary - Cosy Harvest: Pelican Hollow