// 16x16 pixel art sprites defined as color-index strings
// _ = transparent, each letter maps to PALETTE

const PALETTE = {
  _: null,
  // Monkey
  b: '#8B4513', // brown body
  t: '#D2B48C', // tan face/belly
  k: '#000000', // black (eyes, outline)
  w: '#FFFFFF', // white (eye whites)
  // Banana
  y: '#FFD700', // yellow
  Y: '#FFA500', // dark yellow/orange
  // Bush
  g: '#228B22', // green
  G: '#32CD32', // light green
  d: '#006400', // dark green
  // Turtle
  T: '#2E8B57', // turtle shell green
  O: '#FF8C00', // turtle body orange
  // Ground
  e: '#C4A265', // earth/sand
  E: '#B8956A', // earth variant
  // General
  r: '#CC3333', // red
  p: '#FFB6C1', // pink
};

// Direction: 0=right, 1=down, 2=left, 3=up

const MONKEY = [
  // Right-facing
  [
    '____kkkkk_______',
    '___kbbbbkk______',
    '___kbbbbbk______',
    '___kbttbbbk_____',
    '___kttwtwbk_____',
    '___kttttbk______',
    '____kttkk_______',
    '____kbbk________',
    '___kbbbbk_______',
    '___kbkbbk_______',
    '___kbkkbk_______',
    '____kkbk________',
    '____kbbk________',
    '____kkkkk_______',
    '____kb_kbk______',
    '____kk_kkk______',
  ],
  // Down-facing
  [
    '____kkkkk_______',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kbtbtk_______',
    '___kwtwtkk______',
    '___kttttk_______',
    '____kttk________',
    '____kbbk________',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kkbbkk_______',
    '____kbbk________',
    '____kbbk________',
    '___kkkkk________',
    '___kb__bk_______',
    '___kk__kk_______',
  ],
  // Left-facing
  [
    '_______kkkkk____',
    '______kkbbbbk___',
    '______kbbbbbk___',
    '_____kbbbtbbk___',
    '_____kbwtwttk___',
    '______kbtttttk__',
    '_______kkttk____',
    '________kbbk____',
    '_______kbbbbk___',
    '_______kbbkbk___',
    '_______kbkkbk___',
    '________kbkk____',
    '________kbbk____',
    '_______kkkkk____',
    '______kbk_bk___',
    '______kkk_kk___',
  ],
  // Up-facing
  [
    '____kkkkk_______',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '____kbbk________',
    '____kbbk________',
    '___kbbbbk_______',
    '___kbbbbk_______',
    '___kkbbkk_______',
    '____kbbk________',
    '____kbbk________',
    '___kkkkk________',
    '___kb__bk_______',
    '___kk__kk_______',
  ],
];

const BANANA = [
  '________________',
  '________kk______',
  '_______kyk______',
  '______kyyk______',
  '_____kyyyk______',
  '____kyyyyk______',
  '____kyyyyk______',
  '____kyyyyk______',
  '____kyyyYk______',
  '_____kyYYk______',
  '_____kYYk_______',
  '______kk________',
  '________________',
  '________________',
  '________________',
  '________________',
];

const BUSH = [
  '________________',
  '________________',
  '______gGg_______',
  '____gGGGGGg_____',
  '___gGGgGgGGg____',
  '__gGGggGggGGg___',
  '__gGgdgGgdgGg___',
  '_gGGggGGGggGGg__',
  '_gGGGGGGGGGGGg__',
  '_ggGGgGGGgGGgg__',
  '__ggGGGGGGGgg___',
  '___ggGGGGGgg____',
  '____ggggggg_____',
  '________________',
  '________________',
  '________________',
];

const TURTLE = [
  // Right-facing
  [
    '________________',
    '________________',
    '________________',
    '________kk______',
    '______kkOOk_____',
    '____kkTTTOk_____',
    '___kTTTTTTkk____',
    '__kTkTkTkTTk____',
    '__kTTTTTTTTk____',
    '__kkTTTTTTkk____',
    '___kkkkkkkkk____',
    '__kOk____kOk____',
    '__kkk____kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Down
  [
    '________________',
    '________________',
    '________________',
    '____kkkkkkk_____',
    '___kTTTTTTTk____',
    '___kTkTkTkTk____',
    '___kTTTTTTTk____',
    '___kTkTkTkTk____',
    '___kTTTTTTTk____',
    '____kkTTTkk_____',
    '_____kOOOk______',
    '______kOk_______',
    '______kkk_______',
    '________________',
    '________________',
    '________________',
  ],
  // Left-facing
  [
    '________________',
    '________________',
    '________________',
    '______kk________',
    '_____kOOkk______',
    '_____kOTTTkk____',
    '____kkTTTTTTk___',
    '____kTTkTkTkTk__',
    '____kTTTTTTTTk__',
    '____kkTTTTTTkk__',
    '____kkkkkkkkk___',
    '____kOk____kOk__',
    '____kkk____kkk__',
    '________________',
    '________________',
    '________________',
  ],
  // Up
  [
    '________________',
    '________________',
    '________________',
    '______kkk_______',
    '______kOk_______',
    '_____kOOOk______',
    '____kkTTTkk_____',
    '___kTTTTTTTk____',
    '___kTkTkTkTk____',
    '___kTTTTTTTk____',
    '___kTkTkTkTk____',
    '___kTTTTTTTk____',
    '____kkkkkkk_____',
    '________________',
    '________________',
    '________________',
  ],
];

const GROUND = [
  'eeEeeeEeeeeeEeee',
  'eeeeeeeEeeeeeeee',
  'eEeeeeeeeeeEeeee',
  'eeeeeeeeEeeeeeee',
  'eeeeEeeeeeeeeeEe',
  'eeeeeeeeeEeeeeee',
  'eEeeeeeeeeeeEeee',
  'eeeeeeEeeeeeeeee',
  'eeeeeeeeeEeeeEee',
  'eeEeeeeeeeeeeeee',
  'eeeeeeeeeeEeeeee',
  'eeeEeeeeeeeeeeEe',
  'eeeeeeEeeeeeeeee',
  'eEeeeeeeeeEeeeee',
  'eeeeeeeeeeeeeeEe',
  'eeeeEeeeEeeeeeee',
];

const SPARKLE = [
  '________________',
  '________________',
  '________________',
  '______yw________',
  '______yw________',
  '______yw________',
  '___yyywwwyyy____',
  '___wwwyyywww____',
  '______yw________',
  '______yw________',
  '______yw________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];

// Sprite cache: keyed by "name_size"
const cache = new Map();

function renderSpriteData(spriteRows, cellSize) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');
  const px = cellSize / 16;

  for (let row = 0; row < 16; row++) {
    const line = spriteRows[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '_') continue;
      const color = PALETTE[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * px, row * px, px + 0.5, px + 0.5);
    }
  }
  return canvas;
}

export function getSprite(name, direction, cellSize) {
  const dir = direction || 0;
  const key = `${name}_${dir}_${cellSize}`;
  if (cache.has(key)) return cache.get(key);

  let data;
  switch (name) {
    case 'monkey':  data = MONKEY[dir]; break;
    case 'banana':  data = BANANA; break;
    case 'bush':    data = BUSH; break;
    case 'turtle':  data = TURTLE[dir]; break;
    case 'ground':  data = GROUND; break;
    case 'sparkle': data = SPARKLE; break;
    default: return null;
  }

  const rendered = renderSpriteData(data, cellSize);
  cache.set(key, rendered);
  return rendered;
}

export function clearSpriteCache() {
  cache.clear();
}
