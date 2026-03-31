import puzzles from './puzzleData.js';
import { Grid } from '../engine/grid.js';
import { interpret, PuzzleError } from '../engine/interpreter.js';
import { Animator } from '../engine/animator.js';
import { initCanvas, resizeCanvas, draw } from '../renderer/canvas.js';
import { clearSpriteCache } from '../renderer/sprites.js';
import { setCode, getCode, clearErrors, highlightError } from '../editor/editor.js';

let currentPuzzle = null;
let currentGrid = null;
let currentAnimator = null;

// Callbacks set by main.js
let onPuzzleComplete = null;
let onPuzzleFail = null;

export function setCallbacks(onComplete, onFail) {
  onPuzzleComplete = onComplete;
  onPuzzleFail = onFail;
}

export function getPuzzles() {
  return puzzles;
}

export function getCurrentPuzzle() {
  return currentPuzzle;
}

export function getCurrentPuzzleIndex() {
  return currentPuzzle ? puzzles.findIndex(p => p.id === currentPuzzle.id) : -1;
}

export function loadPuzzle(puzzleId, canvasEl) {
  const puzzle = puzzles.find(p => p.id === puzzleId);
  if (!puzzle) return;

  currentPuzzle = puzzle;
  stopAnimation();

  // Setup grid
  currentGrid = new Grid(puzzle);

  // Setup canvas
  clearSpriteCache();
  initCanvas(canvasEl);
  resizeCanvas(puzzle.gridWidth, puzzle.gridHeight);
  draw(currentGrid, null);

  // Setup editor
  setCode(puzzle.starterCode);
  clearErrors();

  // Update UI
  document.getElementById('puzzle-title').textContent =
    `#${puzzle.id}: ${puzzle.title}`;
  document.getElementById('puzzle-concept').textContent = puzzle.concept;
  document.getElementById('error-display').classList.add('hidden');
  document.getElementById('hint-box').textContent = puzzle.hint;
  document.getElementById('hint-box').classList.add('hidden');

  return puzzle;
}

export function resetPuzzle(canvasEl) {
  if (!currentPuzzle) return;
  stopAnimation();
  currentGrid = new Grid(currentPuzzle);
  clearSpriteCache();
  initCanvas(canvasEl);
  resizeCanvas(currentPuzzle.gridWidth, currentPuzzle.gridHeight);
  draw(currentGrid, null);
  clearErrors();
  document.getElementById('error-display').classList.add('hidden');
}

export function runCode(canvasEl) {
  if (!currentPuzzle || !currentGrid) return;

  // Reset before running
  resetPuzzle(canvasEl);

  const code = getCode();
  clearErrors();
  document.getElementById('error-display').classList.add('hidden');

  // Interpret
  let actionQueue;
  try {
    actionQueue = interpret(code, currentGrid, currentPuzzle);
  } catch (e) {
    if (e instanceof PuzzleError) {
      showError(e.message);
      if (e.line != null) highlightError(e.line);
    } else {
      showError(e.message || 'Unknown error');
    }
    return;
  }

  if (actionQueue.length === 0) {
    showError('Your code didn\'t produce any actions. Try using step or turn!');
    return;
  }

  // Animate
  const speedSlider = document.getElementById('speed-slider');
  currentAnimator = new Animator(
    currentGrid,
    (won) => {
      document.getElementById('btn-stop').classList.add('hidden');
      if (won) {
        const stars = calculateStars(code);
        onPuzzleComplete && onPuzzleComplete(currentPuzzle, stars);
      }
    },
    (errorMsg) => {
      showError(errorMsg);
      onPuzzleFail && onPuzzleFail(currentPuzzle, errorMsg);
    }
  );
  currentAnimator.setSpeed(parseInt(speedSlider.value));

  document.getElementById('btn-stop').classList.remove('hidden');
  currentAnimator.play(actionQueue);
}

export function stopAnimation() {
  if (currentAnimator) {
    currentAnimator.stop();
    currentAnimator = null;
  }
  document.getElementById('btn-stop').classList.add('hidden');
}

function showError(msg) {
  const el = document.getElementById('error-display');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function calculateStars(code) {
  if (!currentPuzzle) return 1;
  const lines = code
    .split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('#'))
    .length;
  const [s1, s2, s3] = currentPuzzle.starThresholds;
  if (lines <= s3) return 3;
  if (lines <= s2) return 2;
  return 1;
}

export function getNextPuzzleId() {
  if (!currentPuzzle) return puzzles[0].id;
  const idx = puzzles.findIndex(p => p.id === currentPuzzle.id);
  if (idx < puzzles.length - 1) return puzzles[idx + 1].id;
  return null;
}
