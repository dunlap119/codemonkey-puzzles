import { initEditor, focus } from './editor/editor.js';
import {
  loadPuzzle,
  resetPuzzle,
  runCode,
  stopAnimation,
  setCallbacks,
  getNextPuzzleId,
  getCurrentPuzzle,
} from './puzzles/puzzleLoader.js';
import { renderMenu, saveProgress } from './ui/menu.js';
import { toggleHint, showStars, hideStars } from './ui/hud.js';
import { showSuccess, hideSuccess, showFailure, hideFailure } from './ui/modal.js';
import { waitForImages } from './renderer/sprites.js';

// Screens
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const canvasEl = document.getElementById('game-canvas');
const puzzleGridEl = document.getElementById('puzzle-grid');

// Initialize editor
const editorTextarea = document.getElementById('code-editor');
initEditor(editorTextarea);

// -- Navigation --

function showMenu() {
  stopAnimation();
  gameScreen.classList.add('hidden');
  menuScreen.classList.remove('hidden');
  hideSuccess();
  hideFailure();
  renderMenu(puzzleGridEl, openPuzzle);
}

function openPuzzle(puzzleId) {
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  hideStars();
  hideSuccess();
  hideFailure();
  loadPuzzle(puzzleId, canvasEl);
  // Re-render CodeMirror after display change
  setTimeout(() => focus(), 50);
}

// -- Callbacks --

setCallbacks(
  // onComplete
  (puzzle, stars) => {
    saveProgress(puzzle.id, stars);
    showStars(stars);
    const nextId = getNextPuzzleId();
    showSuccess(stars, nextId === null);
  },
  // onFail
  (puzzle, errorMsg) => {
    // Error already shown in HUD; modal is optional
  }
);

// -- Button Handlers --

document.getElementById('btn-back').addEventListener('click', showMenu);

document.getElementById('btn-run').addEventListener('click', () => {
  hideStars();
  hideSuccess();
  hideFailure();
  runCode(canvasEl);
});

document.getElementById('btn-reset').addEventListener('click', () => {
  hideStars();
  hideFailure();
  document.getElementById('error-display').classList.add('hidden');
  resetPuzzle(canvasEl);
});

document.getElementById('btn-stop').addEventListener('click', () => {
  stopAnimation();
});

document.getElementById('btn-hint').addEventListener('click', toggleHint);

document.getElementById('btn-next').addEventListener('click', () => {
  hideSuccess();
  const nextId = getNextPuzzleId();
  if (nextId) {
    openPuzzle(nextId);
  } else {
    showMenu();
  }
});

document.getElementById('btn-retry').addEventListener('click', () => {
  hideFailure();
  resetPuzzle(canvasEl);
});

// Handle window resize
window.addEventListener('resize', () => {
  const puzzle = getCurrentPuzzle();
  if (puzzle && !menuScreen.classList.contains('hidden')) return;
  if (puzzle) {
    resetPuzzle(canvasEl);
  }
});

// -- Start --
// Wait for PNG images to load, then show menu
waitForImages().then(() => showMenu());
