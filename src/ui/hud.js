export function toggleHint() {
  const hintBox = document.getElementById('hint-box');
  const btn = document.getElementById('btn-hint');
  if (hintBox.classList.contains('hidden')) {
    hintBox.classList.remove('hidden');
    btn.textContent = 'Hide Hint';
  } else {
    hintBox.classList.add('hidden');
    btn.textContent = 'Show Hint';
  }
}

export function showStars(count) {
  const display = document.getElementById('star-display');
  display.classList.remove('hidden');
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`star${i}`);
    el.textContent = '\u2733';
    el.className = i <= count ? 'star star-filled' : 'star star-empty';
    el.textContent = '\u2605';
  }
}

export function hideStars() {
  document.getElementById('star-display').classList.add('hidden');
}
