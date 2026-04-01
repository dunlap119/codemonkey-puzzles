import { initEditor, focus } from './editor/editor.js';
import {
  initPuzzles,
  loadPuzzle,
  resetPuzzle,
  runCode,
  stopAnimation,
  setCallbacks,
  getNextPuzzleId,
  getCurrentPuzzle,
  getPuzzles,
} from './puzzles/puzzleLoader.js';
import { initMenu, renderMenu, saveProgress } from './ui/menu.js';
import { toggleHint, showStars, hideStars } from './ui/hud.js';
import { showSuccess, hideSuccess, showFailure, hideFailure } from './ui/modal.js';
import { showLessonIntro, showAssessment } from './ui/lessonPanel.js';
import { waitForImages } from './renderer/sprites.js';
import puzzles from './puzzles/puzzleDataPart2.js';

// Initialize Part 2 puzzles with separate progress storage
initPuzzles(puzzles);
initMenu({ storageKey: 'codemonkey_progress_part2', layout: 'lessons' });

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

  // Check for lesson intro before loading puzzle
  const allPuzzles = getPuzzles();
  const puzzle = allPuzzles.find(p => p.id === puzzleId);

  if (puzzle && puzzle.lessonContent) {
    showLessonIntro(puzzle, () => {
      loadPuzzle(puzzleId, canvasEl);
      setTimeout(() => focus(), 50);
    });
  } else {
    loadPuzzle(puzzleId, canvasEl);
    setTimeout(() => focus(), 50);
  }
}

// -- Callbacks --

setCallbacks(
  // onComplete
  (puzzle, stars) => {
    saveProgress(puzzle.id, stars);
    showStars(stars);
    const nextId = getNextPuzzleId();

    // Check if this puzzle has assessments
    if (puzzle.assessments && puzzle.assessments.length > 0) {
      showAssessment(puzzle, () => {
        showSuccess(stars, nextId === null);
      });
    } else {
      showSuccess(stars, nextId === null);
    }
  },
  // onFail
  (puzzle, errorMsg) => {
    // Error already shown in HUD
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
waitForImages().then(() => showMenu());
