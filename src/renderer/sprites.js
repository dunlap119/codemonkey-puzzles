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
    img.onerror = () => resolve(); // graceful fallback
  });
  img.src = src;
  imageLoadPromises.push(promise);
}

// Preload PNG images
loadImage('monkey_png', './assets/monkey.png');
loadImage('banana_png', './assets/banana.png');

export function waitForImages() {
  return Promise.all(imageLoadPromises);
}

// ---- Pixel art sprites (bush, turtle, ground, sparkle) ----

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

function renderImageToCanvas(img, cellSize, flipX) {
  const canvas = document.createElement('canvas');
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');

  // Add small padding so sprites don't touch cell edges
  const pad = cellSize * 0.05;
  const drawSize = cellSize - pad * 2;

  if (flipX) {
    ctx.translate(cellSize, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, pad, pad, drawSize, drawSize);

  return canvas;
}

export function getSprite(name, direction, cellSize) {
  const dir = direction || 0;
  const key = `${name}_${dir}_${cellSize}`;
  if (cache.has(key)) return cache.get(key);

  let rendered;

  if (name === 'monkey') {
    const img = imageCache.get('monkey_png');
    if (img) {
      // The monkey PNG faces right. Flip for left direction.
      const flipX = (dir === 2);
      rendered = renderImageToCanvas(img, cellSize, flipX);
    } else {
      // Fallback: simple colored square
      rendered = fallbackSquare(cellSize, '#8B4513');
    }
  } else if (name === 'banana') {
    const img = imageCache.get('banana_png');
    if (img) {
      rendered = renderImageToCanvas(img, cellSize, false);
    } else {
      rendered = fallbackSquare(cellSize, '#FFD700');
    }
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
