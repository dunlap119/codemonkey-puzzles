import { getPuzzles } from '../puzzles/puzzleLoader.js';

const STORAGE_KEY = 'codemonkey_progress';

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(puzzleId, stars) {
  const progress = getProgress();
  const existing = progress[puzzleId] || 0;
  if (stars > existing) {
    progress[puzzleId] = stars;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isUnlocked(puzzleId) {
  if (puzzleId === 1) return true;
  const progress = getProgress();
  // Puzzle N is unlocked if puzzle N-1 has been completed (any stars)
  return !!progress[puzzleId - 1];
}

export function renderMenu(containerEl, onSelectPuzzle) {
  containerEl.innerHTML = '';
  const puzzles = getPuzzles();
  const progress = getProgress();

  for (const puzzle of puzzles) {
    const unlocked = isUnlocked(puzzle.id);
    const stars = progress[puzzle.id] || 0;

    const card = document.createElement('div');
    card.className = `puzzle-card${unlocked ? '' : ' locked'}`;

    const starHtml = unlocked && stars > 0
      ? renderStars(stars)
      : unlocked
      ? '<span class="card-stars">Not attempted</span>'
      : '<span class="card-stars">Locked</span>';

    card.innerHTML = `
      <div class="card-number">${puzzle.id}</div>
      <div class="card-title">${puzzle.title}</div>
      <div class="card-concept">${puzzle.concept}</div>
      ${starHtml}
    `;

    if (unlocked) {
      card.addEventListener('click', () => onSelectPuzzle(puzzle.id));
    }

    containerEl.appendChild(card);
  }
}

function renderStars(count) {
  let html = '<div class="card-stars">';
  for (let i = 0; i < 3; i++) {
    html += i < count
      ? '<span class="star-filled">&#9733;</span>'
      : '<span class="star-empty">&#9733;</span>';
  }
  html += '</div>';
  return html;
}
