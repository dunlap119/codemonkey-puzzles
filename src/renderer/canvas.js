import { getSprite } from './sprites.js';

let canvasEl, ctx;
let cellSize = 48;

export function initCanvas(canvas) {
  canvasEl = canvas;
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
}

export function resizeCanvas(gridW, gridH) {
  const pane = canvasEl.parentElement;
  const maxW = pane.clientWidth - 40;
  const maxH = pane.clientHeight - 80;
  cellSize = Math.floor(Math.min(maxW / gridW, maxH / gridH));
  cellSize = Math.max(cellSize, 24);
  canvasEl.width = gridW * cellSize;
  canvasEl.height = gridH * cellSize;
  ctx.imageSmoothingEnabled = false;
}

export function getCellSize() {
  return cellSize;
}

export function draw(grid, animState) {
  const w = grid.width;
  const h = grid.height;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // Draw ground tiles
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const groundSprite = getSprite('ground', 0, cellSize);
      ctx.drawImage(groundSprite, x * cellSize, y * cellSize);

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw entities (bushes, bananas, turtle)
  for (const entity of grid.entities) {
    if (entity.removed) continue;
    const sprite = getSprite(entity.type, entity.direction || 0, cellSize);
    if (sprite) {
      ctx.drawImage(sprite, entity.x * cellSize, entity.y * cellSize);
    }
  }

  // Draw sparkle effects
  if (animState && animState.sparkles) {
    for (const sp of animState.sparkles) {
      if (sp.active) {
        ctx.globalAlpha = sp.alpha;
        const sprite = getSprite('sparkle', 0, cellSize);
        ctx.drawImage(sprite, sp.x * cellSize, sp.y * cellSize);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Draw monkey
  const monkey = grid.monkey;
  const mx = animState ? animState.pixelX : monkey.x * cellSize;
  const my = animState ? animState.pixelY : monkey.y * cellSize;
  const dir = animState ? animState.direction : monkey.direction;
  const monkeySprite = getSprite('monkey', dir, cellSize);
  ctx.drawImage(monkeySprite, mx, my);
}
