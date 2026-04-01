// Sprites: monkey and banana use PNG images; others use 16x16 pixel art

const PALETTE = {
  _: null,
  // Bush
  g: '#228B22', G: '#32CD32', d: '#006400',
  // Turtle
  T: '#2E8B57', O: '#FF8C00', k: '#000000',
  // Ground
  e: '#C4A265', E: '#B8956A',
  // Sparkle
  y: '#FFD700', w: '#FFFFFF',
  // Goat
  W: '#F5F5F5', A: '#AAAAAA', H: '#8B7355', P: '#FFB6C1',
  // Cat
  o: '#FF8C00', p: '#FFB347', n: '#2B1B0E',
  // Penguin
  K: '#1A1A1A', B: '#4169E1', R: '#DC143C',
  // Match
  m: '#8B4513', r: '#FF4500',
  // Pile
  L: '#A0522D', l: '#CD853F',
  // Bear
  b: '#8B4513', C: '#A0522D',
  // Tiger
  S: '#FF6600', s: '#CC4400',
  // Ice/Frozen
  i: '#88CCFF', I: '#AADDFF',
  // Green tint
  V: '#44AA44', v: '#66CC66',
  // Sleeping Z
  Z: '#AACCFF',
};

// ---- PNG image sprites ----

const imageCache = new Map();
const imageLoadPromises = [];

function loadImage(name, src) {
  const img = new Image();
  const promise = new Promise((resolve) => {
    img.onload = () => {
      imageCache.set(name, img);
      resolve();
    };
    img.onerror = () => resolve();
  });
  img.src = src;
  imageLoadPromises.push(promise);
}

loadImage('monkey_png', './assets/monkey.png');
loadImage('banana_png', './assets/banana.png');

export function waitForImages() {
  return Promise.all(imageLoadPromises);
}

// ---- Pixel art sprites ----

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
  // Right
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
  // Left
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

// ---- Goat (4 directions) ----
const GOAT = [
  // Right
  [
    '________________',
    '________________',
    '_________HH_____',
    '________HkkH____',
    '______kkWWk_____',
    '_____kWWWWWk____',
    '____kWWWWWWWk___',
    '____kWWAWAWWk___',
    '____kWWWWWWWk___',
    '_____kWWWWWk____',
    '_____kkkkkkk____',
    '____kAk__kAk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Down
  [
    '________________',
    '________________',
    '___HH____HH____',
    '___HkkH_HkkH____',
    '____kkWWWkk_____',
    '____kWWWWWk_____',
    '____kWWWWWk_____',
    '____kWkWkWk_____',
    '____kWWWWWk_____',
    '_____kWWWk______',
    '_____kPPPk______',
    '______kPk_______',
    '______kkk_______',
    '________________',
    '________________',
    '________________',
  ],
  // Left
  [
    '________________',
    '________________',
    '_____HH_________',
    '____HkkH________',
    '_____kWWkk______',
    '____kWWWWWk_____',
    '___kWWWWWWWk____',
    '___kWWAWAWWk____',
    '___kWWWWWWWk____',
    '____kWWWWWk_____',
    '____kkkkkkk_____',
    '____kAk__kAk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Up
  [
    '________________',
    '________________',
    '___HH____HH____',
    '___HkkH_HkkH____',
    '____kkWWWkk_____',
    '____kWWWWWk_____',
    '____kWkWkWk_____',
    '____kWWWWWk_____',
    '____kWkWkWk_____',
    '____kWWWWWk_____',
    '_____kkkkk______',
    '____kAk_kAk_____',
    '____kkk_kkk_____',
    '________________',
    '________________',
    '________________',
  ],
];

// ---- Cat (awake - 4 directions) ----
const CAT = [
  // Right
  [
    '________________',
    '________________',
    '________ok______',
    '_______oook_____',
    '______koopk_____',
    '_____koooook____',
    '____koooooook___',
    '____koopoppok___',
    '____kooooooook__',
    '_____kooooook___',
    '______kkkkkkk___',
    '_____kok__kok___',
    '_____kkk__kkk___',
    '________________',
    '________________',
    '________________',
  ],
  // Down
  [
    '________________',
    '________________',
    '___ok______ok___',
    '___ook____ook___',
    '____kooooook____',
    '____koooooook___',
    '____koooooook___',
    '____kokookook___',
    '____koooooook___',
    '_____koooook____',
    '_____kppppk_____',
    '______kppk______',
    '______kkk_______',
    '________________',
    '________________',
    '________________',
  ],
  // Left
  [
    '________________',
    '________________',
    '______ko________',
    '_____kooo_______',
    '_____kpoook_____',
    '____kooooook____',
    '___koooooook____',
    '___kopoppoook___',
    '__koooooooook___',
    '___kooooook_____',
    '___kkkkkkk______',
    '___kok__kok_____',
    '___kkk__kkk_____',
    '________________',
    '________________',
    '________________',
  ],
  // Up
  [
    '________________',
    '________________',
    '______kkk_______',
    '______kppk______',
    '_____kppppk_____',
    '____koooook_____',
    '____koooooook___',
    '____koooooook___',
    '____koooooook___',
    '____kooooook____',
    '____kooooook____',
    '___ok______ok___',
    '___kkk____kkk___',
    '________________',
    '________________',
    '________________',
  ],
];

// Cat sleeping (single orientation)
const CAT_SLEEPING = [
  '________________',
  '________________',
  '________ZZ______',
  '_______Z________',
  '______Z_________',
  '____kkkkkkkkk___',
  '___koooooooook__',
  '___koppooopook__',
  '___koooooooook__',
  '___kooooppoook__',
  '____kkooooookk__',
  '_____kkkkkkkk___',
  '________________',
  '________________',
  '________________',
  '________________',
];

// ---- Penguin ----
const PENGUIN_BASE = [
  '________________',
  '________________',
  '______kkk_______',
  '_____kKKKk______',
  '____kKKKKKk_____',
  '____kKKwwKk_____',
  '____kKwkkwk_____',
  '____kKKppKk_____',
  '___kkKwwwKkk____',
  '___kKKwwwKKk____',
  '___kKKwwwKKk____',
  '____kkwwwkk_____',
  '____kOkkkOk_____',
  '____kOk_kOk_____',
  '________________',
  '________________',
];

// Glasses overlay (drawn on top of penguin)
const PENGUIN_GLASSES = [
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '___kBBkkBBk_____',
  '___kBBkkBBk_____',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];

// Bowtie overlay
const PENGUIN_BOWTIE = [
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '____RkRkRkR_____',
  '_____RkRkR______',
  '____RkRkRkR_____',
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
];

// ---- Match (collectible stick) ----
const MATCH = [
  '________________',
  '________________',
  '________________',
  '_______rr_______',
  '______rOrr______',
  '______rrOr______',
  '_______mm_______',
  '_______mm_______',
  '_______mm_______',
  '_______mm_______',
  '_______mm_______',
  '_______mm_______',
  '_______mm_______',
  '________________',
  '________________',
  '________________',
];

// ---- Pile (stack of items) ----
const PILE = [
  '________________',
  '________________',
  '________________',
  '________________',
  '________________',
  '______lLl_______',
  '_____LlLlL______',
  '____lLlLlLl_____',
  '___LlLlLlLlL____',
  '___llLlLlLll____',
  '____LlLlLlL_____',
  '____lllllll_____',
  '________________',
  '________________',
  '________________',
  '________________',
];

// ---- Bear (right-facing, others derived) ----
const BEAR = [
  // Right
  [
    '________________',
    '________________',
    '________bk______',
    '_______bCCbk____',
    '______kCCCCk____',
    '_____kCCCCCCk___',
    '____kCCCCCCCk___',
    '____kCCkCkCCk___',
    '____kCCCCCCCCk__',
    '_____kCCCCCCk___',
    '______kkkkkk____',
    '_____kCk_kCk____',
    '_____kkk_kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Down
  [
    '________________',
    '________________',
    '___bk_____bk____',
    '___bCbk__bCbk___',
    '____kCCCCCCk____',
    '____kCCCCCCk____',
    '____kCCCCCCk____',
    '____kCkCCkCk____',
    '____kCCppCCk____',
    '_____kCCCCk_____',
    '______kkkk______',
    '____kCk__kCk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Left
  [
    '________________',
    '________________',
    '______kb________',
    '____kbCCb_______',
    '____kCCCCk______',
    '___kCCCCCCk_____',
    '___kCCCCCCCk____',
    '___kCCkCkCCk____',
    '__kCCCCCCCCk____',
    '___kCCCCCCk_____',
    '____kkkkkk______',
    '____kCk_kCk_____',
    '____kkk_kkk_____',
    '________________',
    '________________',
    '________________',
  ],
  // Up
  [
    '________________',
    '________________',
    '____kb_____kb___',
    '___kbCb__kbCb___',
    '____kCCCCCCk____',
    '____kCCCCCCk____',
    '____kCkCCkCk____',
    '____kCCCCCCk____',
    '____kCCCCCCk____',
    '____kCCCCCCk____',
    '______kkkk______',
    '____kCk__kCk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
];

// ---- Tiger ----
const TIGER = [
  // Right
  [
    '________________',
    '________________',
    '________Sk______',
    '_______SSkk_____',
    '______kSSkSk____',
    '_____kSkSSkSk___',
    '____kSSkSSkSSk__',
    '____kSkSkSkSk___',
    '____kSSSSSSSSk__',
    '_____kSSkSSk____',
    '______kkkkkk____',
    '_____kSk_kSk____',
    '_____kkk_kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Down
  [
    '________________',
    '________________',
    '___Sk_____Sk____',
    '___SSkk__SSkk___',
    '____kSSkSSk_____',
    '____kSkSkSkk____',
    '____kSSkSSkk____',
    '____kSkSkSkk____',
    '____kSSppSSk____',
    '_____kSSSk______',
    '______kkkk______',
    '____kSk__kSk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
  // Left
  [
    '________________',
    '________________',
    '______kS________',
    '_____kkSS_______',
    '____kSkSSk______',
    '___kSkSSkSk_____',
    '__kSSkSSkSSk____',
    '___kSkSkSkSk____',
    '__kSSSSSSSSk____',
    '____kSSkSSk_____',
    '____kkkkkk______',
    '____kSk_kSk_____',
    '____kkk_kkk_____',
    '________________',
    '________________',
    '________________',
  ],
  // Up
  [
    '________________',
    '________________',
    '____kS_____kS___',
    '___kkSS__kkSS___',
    '_____kSSkSSk____',
    '____kkSkSkSk____',
    '____kkSSkSSk____',
    '____kkSkSkSk____',
    '____kSSkSSkk____',
    '____kSSSSSk_____',
    '______kkkk______',
    '____kSk__kSk____',
    '____kkk__kkk____',
    '________________',
    '________________',
    '________________',
  ],
];

// ---- Rendering ----

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

function renderComposite(layers, cellSize) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');
  for (const layer of layers) {
    const sprite = renderSpriteData(layer, cellSize);
    ctx.drawImage(sprite, 0, 0);
  }
  return canvas;
}

function renderImageToCanvas(img, cellSize, flipX) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');
  const pad = cellSize * 0.05;
  const drawSize = cellSize - pad * 2;

  if (flipX) {
    ctx.translate(cellSize, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, pad, pad, drawSize, drawSize);

  return canvas;
}

function renderTintedImage(img, cellSize, tintColor, alpha) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');
  const pad = cellSize * 0.05;
  const drawSize = cellSize - pad * 2;

  // Draw original banana
  ctx.drawImage(img, pad, pad, drawSize, drawSize);

  // Apply tint using source-atop composite
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, cellSize, cellSize);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  return canvas;
}

export function getSprite(name, direction, cellSize, entityData) {
  const dir = direction || 0;
  // Build cache key including entity properties
  let variant = '';
  if (entityData) {
    if (entityData.frozen) variant += '_frozen';
    if (entityData.green) variant += '_green';
    if (entityData.sleeping) variant += '_sleeping';
    if (entityData.hasGlasses) variant += '_glasses';
    if (entityData.hasBowTie) variant += '_bowtie';
  }
  const key = `${name}_${dir}_${cellSize}${variant}`;
  if (cache.has(key)) return cache.get(key);

  let rendered;

  if (name === 'monkey') {
    const img = imageCache.get('monkey_png');
    if (img) {
      const flipX = (dir === 2);
      rendered = renderImageToCanvas(img, cellSize, flipX);
    } else {
      rendered = fallbackSquare(cellSize, '#8B4513');
    }
  } else if (name === 'banana') {
    const img = imageCache.get('banana_png');
    if (img) {
      if (entityData && entityData.frozen) {
        rendered = renderTintedImage(img, cellSize, '#4488FF', 0.45);
      } else if (entityData && entityData.green) {
        rendered = renderTintedImage(img, cellSize, '#00AA00', 0.45);
      } else {
        rendered = renderImageToCanvas(img, cellSize, false);
      }
    } else {
      if (entityData && entityData.frozen) {
        rendered = fallbackSquare(cellSize, '#88BBFF');
      } else if (entityData && entityData.green) {
        rendered = fallbackSquare(cellSize, '#44AA44');
      } else {
        rendered = fallbackSquare(cellSize, '#FFD700');
      }
    }
  } else if (name === 'goat') {
    rendered = renderSpriteData(GOAT[dir], cellSize);
  } else if (name === 'cat') {
    if (entityData && entityData.sleeping && entityData.wakesAt !== undefined) {
      rendered = renderSpriteData(CAT_SLEEPING, cellSize);
    } else {
      rendered = renderSpriteData(CAT[dir], cellSize);
    }
  } else if (name === 'penguin') {
    const layers = [PENGUIN_BASE];
    if (entityData && entityData.hasGlasses) layers.push(PENGUIN_GLASSES);
    if (entityData && entityData.hasBowTie) layers.push(PENGUIN_BOWTIE);
    rendered = renderComposite(layers, cellSize);
  } else if (name === 'bear') {
    rendered = renderSpriteData(BEAR[dir], cellSize);
  } else if (name === 'tiger') {
    rendered = renderSpriteData(TIGER[dir], cellSize);
  } else if (name === 'match') {
    rendered = renderSpriteData(MATCH, cellSize);
  } else if (name === 'pile') {
    rendered = renderSpriteData(PILE, cellSize);
  } else {
    let data;
    switch (name) {
      case 'bush':    data = BUSH; break;
      case 'turtle':  data = TURTLE[dir]; break;
      case 'ground':  data = GROUND; break;
      case 'sparkle': data = SPARKLE; break;
      default: return null;
    }
    rendered = renderSpriteData(data, cellSize);
  }

  cache.set(key, rendered);
  return rendered;
}

function fallbackSquare(cellSize, color) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(4, 4, cellSize - 8, cellSize - 8);
  return canvas;
}

export function clearSpriteCache() {
  cache.clear();
}
