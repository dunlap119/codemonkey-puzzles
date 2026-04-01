import { getPuzzles } from '../puzzles/puzzleLoader.js';

let STORAGE_KEY = 'codemonkey_progress';
let layoutMode = 'flat'; // 'flat' or 'lessons'

export function initMenu(config) {
  if (config.storageKey) STORAGE_KEY = config.storageKey;
  if (config.layout) layoutMode = config.layout;
}

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
  return !!progress[puzzleId - 1];
}

export function renderMenu(containerEl, onSelectPuzzle) {
  containerEl.innerHTML = '';
  const puzzles = getPuzzles();
  const progress = getProgress();

  if (layoutMode === 'lessons') {
    // Group by lesson with headers
    const lessonGroups = groupByLesson(puzzles);
    for (const group of lessonGroups) {
      const lessonSection = document.createElement('div');
      lessonSection.className = 'lesson-group';

      const lessonHeader = document.createElement('div');
      lessonHeader.className = 'lesson-header';
      lessonHeader.innerHTML = `<span class="lesson-num">Lesson ${group.lesson}</span> <span class="lesson-name">${group.title}</span>`;
      lessonSection.appendChild(lessonHeader);

      const lessonGrid = document.createElement('div');
      lessonGrid.className = 'puzzle-grid-section lesson-puzzles';
      renderPuzzleCards(lessonGrid, group.puzzles, progress, onSelectPuzzle);
      lessonSection.appendChild(lessonGrid);

      containerEl.appendChild(lessonSection);
    }
  } else {
    // Flat grid
    const grid = document.createElement('div');
    grid.className = 'puzzle-grid-section';
    renderPuzzleCards(grid, puzzles, progress, onSelectPuzzle);
    containerEl.appendChild(grid);
  }
}

function groupByLesson(puzzles) {
  const map = new Map();
  for (const p of puzzles) {
    const key = p.lesson;
    if (!map.has(key)) {
      map.set(key, { lesson: key, title: p.lessonTitle || '', puzzles: [] });
    }
    map.get(key).puzzles.push(p);
  }
  return Array.from(map.values());
}

function renderPuzzleCards(container, puzzles, progress, onSelectPuzzle) {
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

    container.appendChild(card);
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
